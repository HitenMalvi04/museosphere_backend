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

router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findOne({event_id: req.params.id});
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, description, date, price, event_image } = req.body;

    // Validate required fields
    if (!name || !description || !date || !price) {
      return res.status(400).json({ message: 'All required fields (name, description, date, price) must be provided.' });
    }

    // Create a new event document
    const newEvent = new Event({
      name,
      description,
      date,
      price,
      event_image
    });

    // Save the new event to the database
    const savedEvent = await newEvent.save();

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      event: savedEvent
    });
  } catch (err) {
    console.error('Error creating event:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
