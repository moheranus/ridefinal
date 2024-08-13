const Hotel = require('../models/hotel');

// Get all hotels
exports.getHotels = async (req, res) => {
  try {
    const hotel = await Hotel.find();
    res.json(hotel);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add a new hotel
exports.addHotel = async (req, res) => {
  const { hotelName } = req.body;
  const hotel = new Hotel({ hotelName });
  try {
    const newHotel = await hotel.save();
    res.status(201).json(newHotel);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update a hotel
exports.updateHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(hotel);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a hotel
exports.deleteHotel = async (req, res) => {
  try {
    await Hotel.findByIdAndDelete(req.params.id);
    res.json({ message: 'Hotel deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
