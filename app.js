require('dotenv').config();
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');

const { connectDB } = require('./config/db');

// External Routers (EJS backward compatibility)
const userRouter = require('./routes/userRouter');
const { hostRouter } = require('./routes/hostRouter');

// API Routers for React Frontend & MongoDB
const apiAuthRouter = require('./routes/apiAuthRouter');
const apiHomeRouter = require('./routes/apiHomeRouter');

const app = express();

// Connect to MongoDB
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static public assets
app.use('/public', express.static(path.join(__dirname, 'public')));

// EJS View Engine setup (preserved)
app.set('view engine', 'ejs');
app.set('views', 'views');

// Mount REST API endpoints
app.use('/api/auth', apiAuthRouter);
app.use('/api/homes', apiHomeRouter);

// Mount existing EJS routers (preserved)
app.use('/user', userRouter);
app.use('/host', hostRouter);

// Serve React production build if available
const frontendDistPath = path.join(__dirname, 'frontend', 'dist');
if (fs.existsSync(frontendDistPath)) {
  app.use(express.static(frontendDistPath));
  app.use((req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/user') || req.path.startsWith('/host')) {
      return next();
    }
    if (req.method === 'GET' && req.accepts('html')) {
      return res.sendFile(path.join(frontendDistPath, 'index.html'));
    }
    next();
  });
} else {
  // Default redirect to /user when react frontend is not yet built
  app.get('/', (req, res) => {
    res.redirect('/user');
  });
}

// 404 Page handler (for API and unmatched SSR pages)
app.use((req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ success: false, message: 'API route not found' });
  }
  res.status(404).render('404', { title: 'Page Not Found' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`========================================`);
  console.log(`🚀 Airbnb Server running at http://localhost:${PORT}`);
  console.log(`📡 REST API: http://localhost:${PORT}/api/homes`);
  console.log(`🔑 Host Auth API: http://localhost:${PORT}/api/auth/login`);
  console.log(`👤 Default Host: host@airbnb.com / host123`);
  console.log(`========================================`);
});

module.exports = app;