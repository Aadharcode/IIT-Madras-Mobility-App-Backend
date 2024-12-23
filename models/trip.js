const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Define the schema for Trip
const tripSchema = new Schema({
  monuments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Monument', // Reference to Monument model
    required: true
  }],
  startMonumentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Monument',
    required: false, // Optional, if needed
  },
  endMonumentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Monument',
    required: false, // Optional, if needed
  },
  startTime: {
    type: Date,
    required: false, // Optional, you can add validation if needed
  },
  endTime: {
    type: Date,
    required: false, // Optional
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to User model
    required: true,
  },
  purpose: {
    type: String,
    required: false, // Optional
  },
  mode: {
    type: String,
    required: false, // Optional
  }
}, {
  timestamps: true // Automatically add createdAt and updatedAt fields
});

// Create a model from the schema
const Trip = mongoose.model('Trip', tripSchema);

// Export the model for use in other files
module.exports = Trip;
