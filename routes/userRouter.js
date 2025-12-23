// Core Module
const path = require('path');
// External Module
const express = require('express');
const userRouter = express.Router();

// Home Page
userRouter.get("/", (req, res, next) => {
  res.sendFile(path.join(__dirname,'..', 'views', 'welcome_page.html'));
});

module.exports = userRouter;