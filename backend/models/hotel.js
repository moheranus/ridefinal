const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
  hotelName: { type: String, required: true },
});

module.exports = mongoose.model('Hotel', hotelSchema);
