const express = require('express');
const router = express.Router();
const Ticket = require('../models/Ticket');
const Event = require('../models/Event');
const stripe = require('stripe')('sk_test_51PxdpLRtyulDddhmMmxGztP6Uq7F0AVdgEaZd2YVEWPGFn2A2jvmVqkun9hiTHStwCIBvglnjpdH8JazMyh6FLG900fzVdA6jp');


router.post('/book', async (req, res) => {
    try {
        const { user_id, name,ticket_date ,email, phone_number, event_id, tickets, total_price, payment_status } = req.body;
       
        // Validate required fields
        if (!name || !email || !phone_number || !tickets || !total_price) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        
        // Check if the event exists
        let event = null;
        if (event_id) {
            event = await Event.findOne({ event_id: Number(event_id)});
            if (!event) {
                return res.status(404).json({ success: false, message: 'Event not found' });
            }
        }
      
        // Create new ticket booking entry
        const newTicket = new Ticket({
            user_id: user_id || null, // Can be null for guests
            name,
            email,
            ticket_date,
            phone_number,
            event_id : event_id || null,
            tickets, // Array of ticket types (Adult, Child, etc.)
            total_price,
            payment_status: payment_status || 'done', // Default to 'pending'
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
router.post('/create-checkout-session', async (req, res) => {
    const { products } = req.body;  // Assuming products is an array of items with name and price
  
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: products.map(product => ({
          price_data: {
            currency: 'usd',
            product_data: {
              name: product.name,
            },
            unit_amount: product.price * 100, // price in cents
          },
          quantity: product.quantity,
        })),
        mode: 'payment',
        success_url: `${process.env.CLIENT_URL}`,
        cancel_url: `${process.env.CLIENT_URL}/TicketBooking`,
      });
  
      res.status(200).json({ id: session.id });
    } catch (error) {
      res.status(500).json({ error: 'Error creating checkout session' });
    }
  });

module.exports = router;
