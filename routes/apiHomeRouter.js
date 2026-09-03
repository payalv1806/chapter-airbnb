const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const Home = require('../models/Home');
const { verifyHost } = require('../middleware/auth');
const { getIsConnected } = require('../config/db');

// In-memory fallback homes initialized from data/homes.json
let fallbackHomes = [];
try {
  const jsonPath = path.join(__dirname, '..', 'data', 'homes.json');
  if (fs.existsSync(jsonPath)) {
    const raw = fs.readFileSync(jsonPath, 'utf8');
    const parsed = JSON.parse(raw);
    fallbackHomes = parsed.map((h, idx) => ({
      _id: 'seed-' + (h.id || idx + 1),
      houseName: h.houseName || h.name || 'Cozy Place',
      pricePerNight: Number(h.pricePerNight) || 120,
      location: h.location || 'Lakeview',
      rating: Number(h.rating) || 4.5,
      photoUrl: h.photoUrl || 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80',
      description: `Charming accommodation located in ${h.location || 'a prime spot'}. Includes all amenities for a relaxing stay.`,
      hostName: 'Demo Host',
      createdAt: new Date()
    }));
  }
} catch (e) {
  console.error('Notice loading fallback homes:', e.message);
}

// GET /api/homes - List all homes (with optional search filter)
router.get('/', async (req, res) => {
  try {
    const { search } = req.query;

    if (getIsConnected()) {
      let filter = {};
      if (search && search.trim()) {
        const regex = new RegExp(search.trim(), 'i');
        filter = {
          $or: [{ houseName: regex }, { location: regex }, { description: regex }]
        };
      }
      const homes = await Home.find(filter).sort({ createdAt: -1 });
      return res.json({
        success: true,
        count: homes.length,
        isMongoConnected: true,
        homes
      });
    } else {
      // Fallback
      let result = [...fallbackHomes];
      if (search && search.trim()) {
        const query = search.trim().toLowerCase();
        result = result.filter(
          h =>
            h.houseName.toLowerCase().includes(query) ||
            h.location.toLowerCase().includes(query)
        );
      }
      return res.json({
        success: true,
        count: result.length,
        isMongoConnected: false,
        notice: 'Serving data from local memory/JSON fallback while MongoDB initializes.',
        homes: result
      });
    }
  } catch (err) {
    console.error('Error fetching homes:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch homes.'
    });
  }
});

// GET /api/homes/:id - Get single home details
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (getIsConnected()) {
      const home = await Home.findById(id).populate('host', 'name email phone');
      if (!home) {
        return res.status(404).json({ success: false, message: 'Home listing not found.' });
      }
      return res.json({ success: true, home });
    } else {
      const home = fallbackHomes.find(h => String(h._id) === String(id));
      if (!home) {
        return res.status(404).json({ success: false, message: 'Home listing not found.' });
      }
      return res.json({ success: true, home });
    }
  } catch (err) {
    console.error('Error fetching home details:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch home details.' });
  }
});

// POST /api/homes - Create a new home listing (Protected: Host only)
router.post('/', verifyHost, async (req, res) => {
  try {
    const { houseName, pricePerNight, location, rating, photoUrl, description } = req.body;

    if (!houseName || !pricePerNight || !location) {
      return res.status(400).json({
        success: false,
        message: 'House name, price per night, and location are required.'
      });
    }

    const homeData = {
      houseName: houseName.trim(),
      pricePerNight: Number(pricePerNight),
      location: location.trim(),
      rating: rating ? Number(rating) : 4.5,
      photoUrl: photoUrl && photoUrl.trim()
        ? photoUrl.trim()
        : 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80',
      description: description && description.trim()
        ? description.trim()
        : `Beautiful stay at ${houseName.trim()} in ${location.trim()}. Enjoy standard Airbnb comfort and cleanliness.`,
      host: req.hostUser.id,
      hostName: req.hostUser.name || 'Airbnb Host',
      createdAt: new Date()
    };

    if (getIsConnected()) {
      const newHome = await Home.create(homeData);
      return res.status(201).json({
        success: true,
        message: 'Home registered successfully!',
        home: newHome
      });
    } else {
      const newHome = {
        _id: 'home-' + Date.now(),
        ...homeData
      };
      fallbackHomes.unshift(newHome);
      return res.status(201).json({
        success: true,
        message: 'Home registered successfully (memory/local)!',
        home: newHome
      });
    }
  } catch (err) {
    console.error('Error creating home:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to add home listing.'
    });
  }
});

// DELETE /api/homes/:id - Delete a home listing (Protected: Host only)
router.delete('/:id', verifyHost, async (req, res) => {
  try {
    const { id } = req.params;

    if (getIsConnected()) {
      const deleted = await Home.findByIdAndDelete(id);
      if (!deleted) {
        return res.status(404).json({ success: false, message: 'Home listing not found.' });
      }
      return res.json({ success: true, message: 'Home listing removed successfully.' });
    } else {
      const initialLen = fallbackHomes.length;
      fallbackHomes = fallbackHomes.filter(h => String(h._id) !== String(id));
      if (fallbackHomes.length === initialLen) {
        return res.status(404).json({ success: false, message: 'Home listing not found.' });
      }
      return res.json({ success: true, message: 'Home listing removed successfully.' });
    }
  } catch (err) {
    console.error('Error deleting home:', err);
    res.status(500).json({ success: false, message: 'Failed to delete home.' });
  }
});

module.exports = router;
