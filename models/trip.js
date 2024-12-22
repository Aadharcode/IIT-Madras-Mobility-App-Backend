const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const tripSchema = new Schema({
    monuments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Monument',
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
    
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    purpose: {
        type: String,
        required: false,
    },
    mode:{
        type: String,
        required: false,
    },
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: true
    }
}, {
    timestamps: true
});

const Trip = mongoose.model('Trip', tripSchema);

module.exports = Trip;
