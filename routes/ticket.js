const express = require('express');
const router = express.Router();
const Ticket = require('../models/Ticket');
const Event = require('../models/Event');

router.post('/book', async (req, res) => {
    try {
        const { user_id, name,ticket_date ,email, phone_number, event_id, tickets, total_price, payment_status } = req.body;

        // Validate required fields
        if (!name || !email || !phone_number || !event_id || !tickets || !total_price) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        // Check if the event exists
        const event = await Event.findOne({ event_id: Number(event_id)});
        if (!event) {
            return res.status(404).json({ success: false, message: 'Event not found' });
        }

        // Create new ticket booking entry
        const newTicket = new Ticket({
            user_id: user_id || null, // Can be null for guests
            name,
            email,
            ticket_date,
            phone_number,
            event_id,
            tickets, // Array of ticket types (Adult, Child, etc.)
            total_price,
            payment_status: payment_status || 'pending', // Default to 'pending'
            ticket_status: 'active'
        });

        // Save the ticket to the database
        const savedTicket = await newTicket.save();

        // Respond with success and ticket details
        res.status(201).json({
            success: true,
            message: 'Ticket booked successfully',
            ticket: savedTicket
        });
    } catch (error) {
        console.error('Error booking ticket:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

router.get('/', async (req, res) => {
    try {
        // Retrieve all tickets from the database
        const tickets = await Ticket.find();

        // Respond with success and the list of tickets
        res.status(200).json({
            tickets: tickets
        });
    } catch (error) {
        console.error('Error retrieving tickets:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
