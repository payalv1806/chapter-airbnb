const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
const Host = require('../models/Host');
const Home = require('../models/Home');

let isConnected = false;

const seedInitialData = async () => {
  try {
    // 1. Seed Default Host if none exists
    let defaultHost = await Host.findOne({ email: 'host@airbnb.com' });
    if (!defaultHost) {
      const hashedPassword = await bcrypt.hash('host123', 10);
      defaultHost = await Host.create({
        name: 'Demo Host',
        email: 'host@airbnb.com',
        password: hashedPassword,
        phone: '+91 9876543210',
        role: 'host'
      });
      console.log('✅ Default Host created in MongoDB:');
      console.log('   Host ID / Email: host@airbnb.com');
      console.log('   Password: host123');
    }

    // 2. Seed Homes from data/homes.json if collection is empty
    const homesCount = await Home.countDocuments();
    if (homesCount === 0) {
      const homesFilePath = path.join(__dirname, '..', 'data', 'homes.json');
      if (fs.existsSync(homesFilePath)) {
        const rawData = fs.readFileSync(homesFilePath, 'utf8');
        const initialHomes = JSON.parse(rawData);

        const homesToInsert = initialHomes.map((item, index) => ({
          houseName: item.houseName || item.name || `Home ${index + 1}`,
          pricePerNight: Number(item.pricePerNight) || 100,
          location: item.location || 'Unknown',
          rating: Number(item.rating) || 4.5,
          photoUrl: item.photoUrl || 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80',
          description: `Charming accommodation located in ${item.location || 'a great area'}. Enjoy high comfort, great amenities, and scenic surroundings.`,
          host: defaultHost._id,
          hostName: defaultHost.name
        }));

        await Home.insertMany(homesToInsert);
        console.log(`✅ Seeded ${homesToInsert.length} initial homes into MongoDB.`);
      }
    }
  } catch (seedErr) {
    console.error('⚠️ Notice during MongoDB seeding:', seedErr.message);
  }
};

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/airbnb';
  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 4000
    });
    isConnected = true;
    console.log(`✅ MongoDB Connected successfully to: ${uri.replace(/\/\/.*@/, '//<credentials>@')}`);
    await seedInitialData();
  } catch (err) {
    isConnected = false;
    console.warn('\n⚠️ MongoDB Connection Notice:');
    console.warn(`Could not connect to MongoDB at "${uri}".`);
    console.warn('Reason:', err.message);
    console.warn('💡 Tip: If using local MongoDB, make sure MongoDB service/mongod is running.');
    console.warn('💡 Tip: Or provide a MongoDB Atlas cloud URI in your .env file:');
    console.warn('       MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/airbnb?retryWrites=true&w=majority\n');
  }
};

const getIsConnected = () => isConnected;

module.exports = {
  connectDB,
  getIsConnected,
  seedInitialData
};
