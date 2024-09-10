const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ticketSchema = new Schema({
  ticket_id: { type: Number, required: true, unique: true },
  user_id: { type: Number, ref: 'User', default: null }, // Reference to User schema
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone_number: { type: String, required: true },
  event_id: { type: Number, ref: 'Event', required: true }, // Reference to Event schema
  tickets: [
    {
      ticket_type: { type: String, required: true },
      quantity: { type: Number, required: true },
      price_per_ticket: { type: Number, required: true }
    }
  ],
  total_price: { type: Number, required: true },
  payment_status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
  booking_date: { type: Date, default: Date.now },
  ticket_status: { type: String, enum: ['active', 'cancelled'], default: 'active' }
});

// Add auto-increment for ticket_id
ticketSchema.pre('validate', async function (next) {
  if (this.isNew) { // Only auto-increment for new documents
    const latestTicket = await mongoose.model('Ticket').findOne().sort({ ticket_id: -1 });
    this.ticket_id = latestTicket ? latestTicket.ticket_id + 1 : 106; // Default starting value is 106
  }
  next();
});


module.exports = mongoose.model('Ticket', ticketSchema);
