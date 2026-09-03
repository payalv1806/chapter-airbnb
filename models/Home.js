const mongoose = require('mongoose');

const homeSchema = new mongoose.Schema({
  houseName: {
    type: String,
    required: true,
    trim: true
  },
  pricePerNight: {
    type: Number,
    required: true,
    min: 0
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  rating: {
    type: Number,
    default: 4.5,
    min: 0,
    max: 5
  },
  photoUrl: {
    type: String,
    required: true,
    default: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80'
  },
  description: {
    type: String,
    default: 'A wonderful Airbnb stay with all essential amenities, great natural lighting, and close proximity to local attractions.'
  },
  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Host'
  },
  hostName: {
    type: String,
    default: 'Airbnb Host'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Home', homeSchema);
