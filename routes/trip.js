const express = require('express');
const Trip = require('../models/trip'); 
const Monument = require('../models/monument');
const User = require('../models/user'); 
const JWTAuthenticator = require('../controllers/auth');

const tripRouter = express.Router();

tripRouter.post('/add',JWTAuthenticator,async (req, res) => {
    try {
        const {startTime, endTime, startMonumentId, endMonumentId, monuments,purpose,mode} = req.body;
        const userId = req.userId;
        //validate user id
        const validUser = await User.findById(userId);
        if (!validUser) {
            return res.status(400).json({ message: 'User ID is invalid' });
        }
        
        const monumentIds = monuments.map(monument => monument._id);

        // Validate that all monument IDs exist in the database
        const validMonuments = await Monument.find({ _id: { $in: monumentIds } });
        if (validMonuments.length !== monumentIds.length) {
            return res.status(400).json({ message: 'Some monument IDs are invalid' });
        }

        
        // Create a new trip
        const newTrip = new Trip({
            userId,
            startTime,
            endTime,
            startMonumentId,
            endMonumentId,
            monuments, // Array of valid Monument IDs
            purpose,
            mode
        });
        
        // Save the trip to the database
        await newTrip.save();

        res.status(201).json({trip: newTrip });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error adding trip', error: error.message });
    }
});

// Endpoint to fetch trip details of one user
tripRouter.get('/user',JWTAuthenticator,async (req, res) => {
    try {
        const userId = req.userId;
        const trips = await Trip.find({ userId });
        res.status(200).json(trips);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching trips', error });
    }
});

// Endpoint to fetch all trips
tripRouter.get('/all', async (req, res) => {
    try {
        const trips = await Trip.find();
        res.status(200).json(trips);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching trips', error });
    }
});

module.exports = tripRouter;