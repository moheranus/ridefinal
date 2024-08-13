const mongoose = require('mongoose');

const airportSchema = new mongoose.Schema({
  airportName: { type: String, required: true },
});

module.exports = mongoose.model('Airport', airportSchema);
