import express from 'express';
import bcrypt from 'bcryptjs';
import { Op } from 'sequelize';
import student from '../models/student.js';

const router = express.Router();

// Middleware to require authentication
const requireAuth = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/');
  }
  next();
};

// Route to register
router.get('/register', (req, res) => {
  res.render('register'); // On request => respond with rendering register page
});

// Register attempt
router.post('/register', async (req, res) => {
  // Extract user inputs
  const { username, first_name, last_name, DoB, email, password, phone_number, state, city, address } = req.body;
  // Hash the password
  const passwordHash = await bcrypt.hash(password, 10);

  try {
    // Looks for an account with the given email
    const existingUser = await student.findOne({
      where: {
        [Op.or]: [
          { email: email },
          { username: username }
        ]
      }
    });

    // Returns an error if the user already exists
    if (existingUser) {
      req.flash('error', 'User with this email already exists.');
      return res.redirect('/register');
    }

    // If the user doesn't exist, this creates a new user
    const newStudent = await student.create({
      username: username,
      first_name: first_name,
      last_name: last_name,
      date_of_birth: DoB,
      state: state,
      city: city,
      address: address,
      email: email,
      password_hash: passwordHash,
      phone_number: phone_number
    });

    // Redirects them to dashboard
    return res.redirect('/');
  } catch (error) {
    console.error(error);
  }
  req.flash('error', 'Registration failed. Please try again.');
  return res.redirect('/register');
});

// Route to login
router.get('/', (req, res) => {
  res.render('login'); // On request => respond with rendering login page
});

// Login attempt
router.post('/login', async (req, res) => {
  const { email, password } = req.body; // Extracts email and password from request body

  try {
    // Attempts to find a user with the given email
    const existingStudent = await student.findOne({
      where: {
        [Op.or]: [
          { email: email }
        ]
      }
    });

    // Returns error and redirects if the user isn't found
    if (!existingStudent) {
      req.flash('error', 'User does not exist.');
      return res.redirect('/');
    }

    // Compares inputted password with the stored password if user exists
    const isValid = await bcrypt.compare(password, existingStudent.password_hash);

    // Returns error if it comes back false
    if (!isValid) {
      req.flash('error', 'Invalid password.');
      res.redirect('/');
    }

    // Assigns the session and redirects to dashboard once everything is true
    else {
      req.session.user = existingStudent;
      return res.redirect('/dashboard');
    }
  } catch (e) {
    console.log(e);
  }
});

// Logout
router.get('/logout', (req, res) => {
  // Destroys session
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
    }
    res.redirect('/');
  });
});

export { requireAuth };
export default router;
