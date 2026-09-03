const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Host = require('../models/Host');
const { verifyHost, JWT_SECRET } = require('../middleware/auth');
const { getIsConnected } = require('../config/db');

// In-memory fallback hosts for offline/initial exploration if MongoDB is not started yet
const fallbackHosts = [
  {
    _id: 'default-host-id-001',
    name: 'Demo Host',
    email: 'host@airbnb.com',
    passwordHash: bcrypt.hashSync('host123', 10),
    role: 'host'
  }
];

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const identifier = (email || '').trim().toLowerCase();

    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        message: 'Host ID / Email and Password are required.'
      });
    }

    let hostUser = null;

    if (getIsConnected()) {
      hostUser = await Host.findOne({ email: identifier });
    } else {
      hostUser = fallbackHosts.find(h => h.email.toLowerCase() === identifier);
    }

    if (!hostUser) {
      return res.status(401).json({
        success: false,
        message: 'Invalid Host ID / Email or Password. Demo Host is host@airbnb.com / host123'
      });
    }

    const isMatch = await bcrypt.compare(password, hostUser.password || hostUser.passwordHash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid Host ID / Email or Password.'
      });
    }

    const payload = {
      id: hostUser._id,
      name: hostUser.name,
      email: hostUser.email,
      role: hostUser.role || 'host'
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      success: true,
      message: 'Host logged in successfully!',
      token,
      host: payload
    });
  } catch (err) {
    console.error('Error during host login:', err);
    res.status(500).json({
      success: false,
      message: 'Server error during authentication.'
    });
  }
});

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    const identifier = (email || '').trim().toLowerCase();

    if (!identifier || !password || !name) {
      return res.status(400).json({
        success: false,
        message: 'Name, Host Email / ID, and Password are required.'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    if (getIsConnected()) {
      const existing = await Host.findOne({ email: identifier });
      if (existing) {
        return res.status(400).json({
          success: false,
          message: 'A host account with this ID/email already exists.'
        });
      }

      const newHost = await Host.create({
        name: name.trim(),
        email: identifier,
        password: hashedPassword,
        phone: phone || '',
        role: 'host'
      });

      const payload = {
        id: newHost._id,
        name: newHost.name,
        email: newHost.email,
        role: newHost.role
      };

      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

      return res.status(201).json({
        success: true,
        message: 'Host registered successfully!',
        token,
        host: payload
      });
    } else {
      // Fallback
      const existing = fallbackHosts.find(h => h.email.toLowerCase() === identifier);
      if (existing) {
        return res.status(400).json({
          success: false,
          message: 'A host account with this ID/email already exists.'
        });
      }

      const newHost = {
        _id: 'host-' + Date.now(),
        name: name.trim(),
        email: identifier,
        passwordHash: hashedPassword,
        role: 'host'
      };
      fallbackHosts.push(newHost);

      const payload = {
        id: newHost._id,
        name: newHost.name,
        email: newHost.email,
        role: newHost.role
      };

      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

      return res.status(201).json({
        success: true,
        message: 'Host registered successfully (offline/demo mode)!',
        token,
        host: payload
      });
    }
  } catch (err) {
    console.error('Error registering host:', err);
    res.status(500).json({
      success: false,
      message: 'Server error during host registration.'
    });
  }
});

// GET /api/auth/me
router.get('/me', verifyHost, (req, res) => {
  res.json({
    success: true,
    host: req.hostUser
  });
});

module.exports = router;
