const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  user_id: { type: Number, required: true, unique: true }, // Auto-incremented user_id
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

// Auto-increment user_id before saving
userSchema.pre('validate', async function (next) {
  
  console.log("Came here");
  try {
    if (this.isNew) { // Only auto-increment for new documents
      const latestUser = await mongoose.model('User').findOne().sort({ user_id: -1 });
      this.user_id = latestUser ? latestUser.user_id + 1 : 2205; // Start user_id from 2201
      console.log("this.user_id:::::::", this.user_id);
    }
    next();
  } catch (error) {
    console.log(error);
    next(error); // Pass error to the next middleware
  }
});

// Encrypt password before saving
userSchema.pre('save', async function(next) {
  console.log("came save");
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  
  next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;
