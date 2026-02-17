// Core Module
const path = require('path');

// External Module
const express = require('express');
const hostRouter = express.Router();

// Show form
hostRouter.get("/add-home", (req, res) => {
  res.render('addhome', {title: "Airbnb Home"});
});

const registeredHomes = [];

hostRouter.post('/add-home', (req, res) => {
  registeredHomes.push({
    houseName: req.body.houseName,
    pricePerNight: req.body.pricePerNight,
    location: req.body.location,
    rating: req.body.rating,
    photoUrl: req.body.photoUrl
  });

  res.redirect('/');
});

module.exports= {
  hostRouter,
  registeredHomes
}