// Core Module
const path = require('path');
// External Module
const express = require('express');
const hostRouter = express.Router();

// Show form
hostRouter.get("/add-home", (req, res) => {
  res.sendFile(path.join(__dirname,'..', 'views', 'add_homepage.html'));
});

// Handle form submission
hostRouter.post("/add-home", (req, res) => {
  res.sendFile(path.join(__dirname,'..', 'views', 'home_added.html'));
});

module.exports = hostRouter;