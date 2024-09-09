const express = require('express');
const Event = require('../models/Event');

const router = express.Router();

// Get all events
router.get('/', async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Book Event
router.post('/book', async (req, res) => {
  // For simplicity, assume the booking is always successful.
  res.json({ message: 'Event booked successfully' });
});

module.exports = router;
