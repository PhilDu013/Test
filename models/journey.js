var mongoose = require('mongoose');

var journeySchema = mongoose.Schema({
    departure: String,
    arrival: String,
    date: Date,
    departureTime: String,
    price: Number,
    quantity: Number
  });
  
  var JourneyModel = mongoose.model('journey', journeySchema);

  module.exports = JourneyModel;
