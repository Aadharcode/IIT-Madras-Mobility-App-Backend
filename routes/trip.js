const express = require('express');
const Trip = require('../models/trip'); 
const Monument = require('../models/monument'); 
const User = require('../models/user');
const JWTAuthenticator = require('../controllers/auth');
const { format } = require('fast-csv');

const tripRouter = express.Router();

tripRouter.post('/add',JWTAuthenticator,async (req, res) => {
    try {
        const {startTime, endTime, startMonumentId, endMonumentId, monumentVisits,purpose,mode,occupancy} = req.body;
        const userId = req.userId;
        //validate user id
        const validUser = await User.findById(userId);
        if (!validUser) {
            return res.status(400).json({ message: 'User ID is invalid' });
        }
        
        const monumentIds = monumentVisits.map(monumentVisit => monumentVisit.monument);
        monumentIds.push(startMonumentId);
        monumentIds.push(endMonumentId);
        // Validate that all monument IDs exist in the database
        // const validMonuments = await Monument.find({ _id: { $in: monumentIds } });
        // if (validMonuments.length !== monumentIds.length) {
        //     return res.status(400).json({ message: 'Some monument IDs are invalid' });
        // }

        
        // Create a new trip
        const newTrip = new Trip({
            userId,
            startTime,
            endTime,
            startMonumentId,
            endMonumentId,
            monumentVisits,
            purpose,
            mode,
            occupancy
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

        const updatedTrips = await Promise.all(
            trips.map(async (trip) => {
                const user = await User.findById(trip.userId);
                let monumentsArray = trip.monumentVisits.map(monumentVisit => monumentVisit.monument);
                let timeStampsArray = trip.monumentVisits.map(monumentVisit => monumentVisit.timestamp);
                let tripMonuments = [trip.startMonumentId,...monumentsArray,trip.endMonumentId];
                let timeStamps = [trip.startTime,...timeStampsArray,trip.endTime];
                const monuments = await Monument.find({ _id: { $in: tripMonuments } });
                let monumentNames =  monuments.map(monument => monument.name);
                let monumentDetails = monumentNames.map((name, index) => `${name}(${timeStamps[index]})`).join(',');
                let returnTrip = {user: user.name,number: user.number,monuments:monumentDetails,startTime: trip.startTime,endTime: trip.endTime,purpose: trip.purpose,mode: trip.mode};
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
                let monumentsArray = trip.monumentVisits.map(monumentVisit => monumentVisit.monument);
                let timeStampsArray = trip.monumentVisits.map(monumentVisit => monumentVisit.timestamp);
                let tripMonuments = [trip.startMonumentId,...monumentsArray,trip.endMonumentId];
                let timeStamps = [trip.startTime,...timeStampsArray,trip.endTime];
                const monuments = await Monument.find({ _id: { $in: tripMonuments } });
                let monumentNames =  monuments.map(monument => monument.name);
                let monumentDetails = monumentNames.map((name, index) => `${name}(${timeStamps[index]})`).join(',');
                let returnTrip = {user: user.name,number: user.number,monuments:monumentDetails,startTime: trip.startTime,endTime: trip.endTime,purpose: trip.purpose,mode: trip.mode};
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

tripRouter.patch("/update/:tripId", JWTAuthenticator, async (req, res) => {
    try {
      const { tripId } = req.params;
      const { mode, occupancy, purpose } = req.body;
      const userId = req.userId;
  
      // Find the trip and verify ownership
      const trip = await Trip.findById(tripId);
      if (!trip) {
        return res.status(404).json({ message: "Trip not found" });
      }
  
      // Verify that the user owns this trip
      if (trip.userId.toString() !== userId) {
        return res
          .status(403)
          .json({ message: "Unauthorized to update this trip" });
      }
  
      // Update only the provided fields
      const updateFields = {};
      if (mode !== undefined) updateFields.mode = mode;
      if (occupancy !== undefined) updateFields.occupancy = occupancy;
      if (purpose !== undefined) updateFields.purpose = purpose;
  
      // Update the trip
      const updatedTrip = await Trip.findByIdAndUpdate(
        tripId,
        { $set: updateFields },
        { new: true }
      );
  
      res.status(200).json({ trip: updatedTrip });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "Error updating trip", error: error.message });
    }
  });

module.exports = tripRouter;