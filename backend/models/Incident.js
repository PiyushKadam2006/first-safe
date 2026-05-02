const mongoose = require('mongoose');

const IncidentSchema = new mongoose.Schema({
  impactForce: {
    type: Number,
    required: true,
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'high'
  },
  location: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['pending', 'responded', 'resolved'],
    default: 'pending',
  },
  vehicleId: {
    type: String,
    default: 'V-001', // Placeholder for now
  }
});

module.exports = mongoose.model('Incident', IncidentSchema);
