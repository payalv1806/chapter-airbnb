// Core Module
const path = require('path');

// External Module
const express = require('express');
const userRouter = express.Router();
const homes= require('../data/homes.json');

const {registeredHomes} = require('./hostRouter');

userRouter.get("/", (req, res) => {
  res.json('homes',{homes});
});

// Home Page
userRouter.get("/", (req, res, next) => {
  console.log(registeredHomes);
  res.render('home', {
    title: "Airbnb Home", 
    registeredHomes: registeredHomes});
});

module.exports = userRouter;