const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  roomsAvailable: { type: Number, required: true },
  pricePerNight: { type: Number, required: true }
});

module.exports = mongoose.model('Hotel', hotelSchema);

console.log('Hotel model created.');