const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

// Serialize and deserialize user for session persistence
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id); // Use async/await here
      done(null, user); // If user found, pass it to done
    } catch (err) {
      done(err, null); // If there's an error, pass it to done
    }
  });
  

// Google OAuth Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/api/auth/google/callback'
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if the user already exists in the database
      let user = await User.findOne({ googleId: profile.id });
  
      if (user) {
        // User exists, return user
        done(null, user);
      } else {
        // User does not exist, create a new user
        user = new User({
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value,
        });
  
        await user.save(); // Save the user to the database
        done(null, user); // Return the newly created user
      }
    } catch (err) {
      done(err, null);
    }
  }));
  
