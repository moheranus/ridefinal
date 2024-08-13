const Airport = require('../models/airport');

// Get all airports
exports.getAirports = async (req, res) => {
  try {
    const airports = await Airport.find();
    res.json(airports);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add a new airport
exports.addAirport = async (req, res) => {
  const { airportName } = req.body;
  const airport = new Airport({ airportName });
  try {
    const newAirport = await airport.save();
    res.status(201).json(newAirport);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update a airport
exports.updateAirport = async (req, res) => {
  try {
    const airport = await Airport.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(airport);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a airport
exports.deleteAirport = async (req, res) => {
  try {
    await Airport.findByIdAndDelete(req.params.id);
    res.json({ message: 'Airport deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
