require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/user');
const eventRoutes = require('./routes/event');

const ticketRoutes = require('./routes/ticket');



const app = express();
app.use(express.json());
app.use(cors());
const http = require('http');
const server = http.createServer(app);


// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log(err));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/ticket', ticketRoutes);

const PORT = process.env.PORT || 5050;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
  
  process.on('SIGINT', () => {
    server.close(() => {
      console.log('Process terminated');
      process.exit(0);
    });
  });

