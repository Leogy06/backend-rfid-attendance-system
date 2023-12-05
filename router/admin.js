import express from 'express';
import { Admins } from '../models/admin.js';
import bcrypt from 'bcrypt';
import passport from 'passport';
import LocalStrategy from 'passport-local'
import session from 'express-session';
import { mySecretKey } from '../config.js';

const routes = express.Router();

routes.use(express.json());

// Configure express-session middleware
routes.use(session({
  secret: mySecretKey,
  resave: false,
  saveUninitialized: false,
}));

// Initialize Passport and session support
routes.use(passport.initialize());
routes.use(passport.session());

// Passport.js configuration
passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
}, async (email, password, done) => {
  try {
    const regAdmin = await Admins.findOne({ email });

    if (!regAdmin) {
      return done(null, false, { message: 'User admin not found' });
    }

    const passMatch = await bcrypt.compare(password, regAdmin.password);

    if (passMatch) {
      return done(null, regAdmin);
    } else {
      return done(null, false, { message: 'Password does not match email' });
    }
  } catch (error) {
    return done(error);
  }
}));

// Passport.js serialization and deserialization
passport.serializeUser((admin, done) => {
  done(null, admin.email);
});

passport.deserializeUser((email, done) => {
  Admins.findById(email, (err, admin) => {
    done(err, admin);
  });
});

// Login route using Passport.js
routes.post('/login', passport.authenticate('local', {
  successRedirect: '/home',
  failureRedirect: '/login',
}));

routes.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

// Define isAuthenticated middleware
const isAuthenticated = (req, res, next) => {

  // Passport.js adds isAuthenticated() method to request object
  if (req.isAuthenticated()) {

    // User is authenticated, proceed to the next middleware/route handler
    return next();
  }

  // User is not authenticated, redirect to login page or handle accordingly
  res.redirect('/login');
};

// Usage in your routes
routes.get('/home', isAuthenticated, (req, res) => {

   // Assuming firstName is a property in your Admins model
  res.send('Home page: ' + req.admin.firstName);
});


routes.get('/home', isAuthenticated, (req, res) => {
  res.send('Home page: ' + req.admin.firstName); // Assuming firstName is a property in your Admins model
});

// Admin registration route
routes.post('/register', async (req, res) => {
  try {
    if (
      !req.body.firstName ||
      !req.body.lastName ||
      !req.body.email ||
      !req.body.password ||
      !req.body.department
    ) {
      return res.status(400).send({
        response: 'Required fields are empty',
      });
    }

    const hashedPass = await bcrypt.hash(req.body.password, 10);

    const newAdmin = {
      firstName: req.body.firstName,
      middleName: req.body.middleName || '',
      lastName: req.body.lastName,
      suffix: req.body.suffix || '',
      email: req.body.email,
      password: hashedPass,
      department: req.body.department,
    };

    const admin = await Admins.create(newAdmin);

    await admin.save();

    res.status(200).send({ response: 'Registered', success: true });
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ error: error.message, response: 'Server unreachable, cannot create account.' });
  }
});

export { routes as adminRoutes };