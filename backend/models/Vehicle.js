const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  vehicleName: { type: String, required: true },
  numberOfPassengers: { type: Number, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true }, // This will store the path to the image file
});

module.exports = mongoose.model('Vehicle', vehicleSchema);
