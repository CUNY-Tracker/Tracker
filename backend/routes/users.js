
import express from 'express';
import bcrypt from 'bcryptjs';
import db from '../db.js';

const router = express.Router();

// Register a new student
router.post('/register', async (req, res) => {
  try {
    const { email, password, cunySchool } = req.body;

    // Make sure all required fields are provided
    if (
      typeof email !== 'string' ||
      typeof password !== 'string' ||
      typeof cunySchool !== 'string' ||
      !email.trim() ||
      !password ||
      !cunySchool.trim()
    ) {
      return res.status(400).json({
        error: 'Email, password, and CUNY school are required.'
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check the email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return res.status(400).json({
        error: 'Please enter a valid email address.'
      });
    }

    // Require a password of at least 8 characters
    if (password.length < 8) {
      return res.status(400).json({
        error: 'Password must be at least 8 characters.'
      });
    }

    // Check whether this email is already registered
    const existingUser = await db.execute({
      sql: 'SELECT id FROM users WHERE email = ?',
      args: [normalizedEmail]
    });

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        error: 'An account with this email already exists.'
      });
    }

    // Hash the password before saving it
    const passwordHash = await bcrypt.hash(password, 12);

    // Save the new student in the database
    const result = await db.execute({
      sql: `INSERT INTO users (email, passwordHash, cunySchool)
            VALUES (?, ?, ?)`,
      args: [normalizedEmail, passwordHash, cunySchool.trim()]
    });

    // Return account information without the password
    res.status(201).json({
      message: 'Account created successfully!',
      user: {
        id: Number(result.lastInsertRowid),
        email: normalizedEmail,
        cunySchool: cunySchool.trim()
      }
    });

  } catch (error) {
    console.error('Registration error:', error);

    res.status(500).json({
      error: 'Unable to create account. Please try again.'
    });
  }
});

// Log in an existing student
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Make sure email and password were provided
    if (
      typeof email !== 'string' ||
      typeof password !== 'string' ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
        error: 'Email and password are required.'
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Find the student by email
    const result = await db.execute({
      sql: 'SELECT id, email, passwordHash, cunySchool FROM users WHERE email = ?',
      args: [normalizedEmail]
    });

    const user = result.rows[0];

    // Check whether the account exists
    if (!user) {
      return res.status(401).json({
        error: 'Invalid email or password.'
      });
    }

    // Compare the entered password with the saved password hash
    const passwordMatches = await bcrypt.compare(password, user.passwordHash);

    if (!passwordMatches) {
      return res.status(401).json({
        error: 'Invalid email or password.'
      });
    }

    // Create a new session after successful login
    req.session.regenerate((error) => {
      if (error) {
        console.error('Session error:', error);
        return res.status(500).json({
          error: 'Unable to log in. Please try again.'
        });
      }

      req.session.userId = Number(user.id);

      req.session.save((error) => {
        if (error) {
          console.error('Session save error:', error);
          return res.status(500).json({
            error: 'Unable to log in. Please try again.'
          });
        }

        res.status(200).json({
          message: 'Login successful!',
          user: {
            id: Number(user.id),
            email: user.email,
            cunySchool: user.cunySchool
          }
        });
      });
    });

  } catch (error) {
    console.error('Login error:', error);

    res.status(500).json({
      error: 'Unable to log in. Please try again.'
    });
  }
});

// Check which student is currently logged in
router.get('/me', async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({
      error: 'Not logged in.'
    });
  }

  try {
    const result = await db.execute({
      sql: 'SELECT id, email, cunySchool FROM users WHERE id = ?',
      args: [req.session.userId]
    });

    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({
        error: 'User not found.'
      });
    }

    res.status(200).json({
      user: {
        id: Number(user.id),
        email: user.email,
        cunySchool: user.cunySchool
      }
    });

  } catch (error) {
    console.error('Session check error:', error);

    res.status(500).json({
      error: 'Unable to check login status.'
    });
  }
});

// Log out the current student
router.post('/logout', (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      console.error('Logout error:', error);
      return res.status(500).json({
        error: 'Unable to log out. Please try again.'
      });
    }

    res.clearCookie('internship.sid', {
      path: '/'
    });

    res.status(200).json({
      message: 'Logout successful!'
    });
  });
});

export default router;
