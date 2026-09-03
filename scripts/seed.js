require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
const Host = require('../models/Host');
const Home = require('../models/Home');

const runSeed = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/airbnb';
  try {
    console.log(`Connecting to MongoDB at: ${uri}...`);
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log('Connected to MongoDB!');

    // Clear existing
    await Host.deleteMany({});
    await Home.deleteMany({});

    // Create Default Host
    const hashedPassword = await bcrypt.hash('host123', 10);
    const defaultHost = await Host.create({
      name: 'Demo Host',
      email: 'host@airbnb.com',
      password: hashedPassword,
      phone: '+91 9876543210',
      role: 'host'
    });

    console.log('✅ Created Default Host:');
    console.log('   Email / Host ID: host@airbnb.com');
    console.log('   Password: host123');

    // Read homes.json
    const jsonPath = path.join(__dirname, '..', 'data', 'homes.json');
    if (fs.existsSync(jsonPath)) {
      const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
      const formatted = data.map((h, i) => ({
        houseName: h.houseName || h.name || `Home ${i + 1}`,
        pricePerNight: Number(h.pricePerNight) || 120,
        location: h.location || 'Lakeview',
        rating: Number(h.rating) || 4.5,
        photoUrl: h.photoUrl || 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80',
        description: `Charming accommodation in ${h.location}. High comfort, serene environment, and all essential amenities.`,
        host: defaultHost._id,
        hostName: defaultHost.name
      }));

      const inserted = await Home.insertMany(formatted);
      console.log(`✅ Seeded ${inserted.length} homes into MongoDB.`);
    }

    console.log('\n🎉 Seeding complete successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding error:', err.message);
    process.exit(1);
  }
};

runSeed();
