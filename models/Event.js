const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventSchema = new Schema({
  event_id: { type: Number, required: true, unique: true },  // Auto-incremented event_id
  name: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  price: { type: Number, required: true },
  event_image: { type: String, required: false }
});

// Add auto-increment for event_id
eventSchema.pre('validate', async function (next) {
  if (this.isNew) { // Only auto-increment for new documents
    const latestEvent = await mongoose.model('Event').findOne().sort({ event_id: -1 });
    this.event_id = latestEvent ? latestEvent.event_id + 1 : 1; // Start event_id from 1
  }
  next();
});

module.exports = mongoose.model('Event', eventSchema);
