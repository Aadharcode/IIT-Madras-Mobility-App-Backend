const express = require('express');
const Trip = require('../models/trip'); 
const Monument = require('../models/monument'); 
const User = require('../models/user');
const JWTAuthenticator = require('../controllers/auth');
const { format } = require('fast-csv');

const tripRouter = express.Router();

tripRouter.post('/add',JWTAuthenticator,async (req, res) => {
    try {
        const {monuments,purpose,mode} = req.body;
        const userId = req.userId;
        if (!monuments || !Array.isArray(monuments) || monuments.length === 0) {
            return res.status(400).json({ message: 'At least one monument is required' });
        }
        //validate user id
        const validUser = await User.findById(userId);
        if (!validUser) {
            return res.status(400).json({ message: 'User ID is invalid' });
        }
        // Validate that all monument IDs exist in the database
        const validMonuments = await Monument.find({ _id: { $in: monuments } });
        if (validMonuments.length !== monuments.length) {
            return res.status(400).json({ message: 'Some monument IDs are invalid' });
        }

        // Create a new trip
        const newTrip = new Trip({
            userId,
            monuments, // Array of valid Monument IDs
            purpose,
            mode
        });

        // Save the trip to the database
        await newTrip.save();

        res.status(201).json({trip: newTrip });
    } catch (error) {
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

        const updatedTrips = await Promise.all(
            trips.map(async (trip) => {
                const user = await User.findById(trip.userId);
                let tripMonuments = [trip.startMonumentId,...trip.monuments,trip.endMonumentId];
                const monuments = await Monument.find({ _id: { $in: tripMonuments } });
                let monumentNames =  monuments.map(monument => monument.name);
                let returnTrip = {user: user.name,number: user.number,monuments:monumentNames,startTime: trip.startTime,endTime: trip.endTime,purpose: trip.purpose,mode: trip.mode};
                return returnTrip;
            })
        );
        
        res.status(200).json(updatedTrips);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching trips', error });
    }
});

// Endpoint to fetch all trips as CSV
tripRouter.get('/getData', async (req, res) => {
    try {
        const trips = await Trip.find();

        const updatedTrips = await Promise.all(
            trips.map(async (trip) => {
                const user = await User.findById(trip.userId);
                let tripMonuments = [trip.startMonumentId,...trip.monuments,trip.endMonumentId];
                const monuments = await Monument.find({ _id: { $in: tripMonuments } });
                let monumentNames =  monuments.map(monument => monument.name);
                let returnTrip = {user: user.name,number: user.number,monuments:monumentNames,startTime: trip.startTime,endTime: trip.endTime,purpose: trip.purpose,mode: trip.mode};
                return returnTrip;
            })
        );
        res.setHeader('Content-Disposition', 'attachment; filename="trips.csv"');
        res.setHeader('Content-Type', 'text/csv');
        const csvStream = format({ headers: true });
        csvStream.pipe(res);
        updatedTrips.forEach(trip => csvStream.write(trip));
        csvStream.end();
    } catch (error) {
        res.status(500).json({ message: 'Error fetching trips', error });
    }
});

module.exports = tripRouter;