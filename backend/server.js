require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Incident = require('./models/Incident');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB (Local)'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// Routes

// Trigger a new SOS (Used by Mobile App)
app.post('/api/sos/trigger', async (req, res) => {
  try {
    const { impactForce, location, severity } = req.body;
    
    // Validate required fields
    if (!impactForce || !location) {
      return res.status(400).json({ error: 'Missing required data (impactForce or location)' });
    }

    // Ensure location has latitude and longitude
    const latitude = location.latitude ?? location.lat;
    const longitude = location.longitude ?? location.lng;

    if (latitude === undefined || longitude === undefined) {
      return res.status(400).json({ error: 'Location must include latitude and longitude' });
    }
    
    // Calculate severity if not provided but impactForce is
    let calculatedSeverity = severity;
    if (!calculatedSeverity) {
       if (impactForce > 4.0) calculatedSeverity = 'high';
       else if (impactForce > 2.0) calculatedSeverity = 'medium';
       else calculatedSeverity = 'low';
    }

    const newIncident = new Incident({
      impactForce,
      location: {
        latitude,
        longitude
      },
      severity: calculatedSeverity,
      status: 'pending'
    });

    await newIncident.save();
    console.log('🚨 SOS TRIGGERED:', newIncident);
    res.status(201).json({ message: 'SOS alert received', incident: newIncident });
  } catch (error) {
    console.error('Error triggering SOS:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all incidents (Used by Dashboard)
app.get('/api/incidents', async (req, res) => {
  try {
    const incidents = await Incident.find().sort({ timestamp: -1 });
    res.status(200).json(incidents);
  } catch (error) {
    console.error('Error fetching incidents:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update incident status (e.g., from Dashboard)
app.patch('/api/incidents/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const updatedIncident = await Incident.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.status(200).json(updatedIncident);
  } catch (error) {
    res.status(500).json({ error: 'Error updating incident' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 RoadSoS Backend running on http://localhost:${PORT}`);
});
