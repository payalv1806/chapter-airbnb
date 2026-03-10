// Core Module
const fs = require('fs'); 
const path = require('path');

// External Module
const express = require('express');
const userRouter = express.Router();
const homes= require('../data/homes.json');

const {registeredHomes} = require('./hostRouter');

userRouter.get('home', (req, res) => {
  res.render('home', {
    title: "Airbnb Home",
    registeredHomes: homes
  });
});

module.exports = userRouter;