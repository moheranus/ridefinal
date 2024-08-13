const Vehicle = require('../models/Vehicle');
const fs = require('fs');
const multer = require('multer');
const path = require('path');

// Set up multer for file storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

// Controller functions

// Get all vehicles
exports.getVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find();
    res.status(200).json(vehicles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new vehicle
exports.createVehicle = async (req, res) => {
  try {
    const { vehicleName, numberOfPassengers, price } = req.body;
    const imagePath = req.file ? req.file.path : '';

    const newVehicle = new Vehicle({
      vehicleName,
      numberOfPassengers,
      price,
      image: imagePath,
    });

    await newVehicle.save();
    res.status(201).json(newVehicle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a vehicle
exports.updateVehicle = async (req, res) => {
  try {
    const { id } = req.params;
    const { vehicleName, numberOfPassengers, price } = req.body;
    const imagePath = req.file ? req.file.path : req.body.image;

    const updatedVehicle = await Vehicle.findByIdAndUpdate(
      id,
      { vehicleName, numberOfPassengers, price, image: imagePath },
      { new: true }
    );

    if (!updatedVehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    res.status(200).json(updatedVehicle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a vehicle
exports.deleteVehicle = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the vehicle to get the image path
    const vehicle = await Vehicle.findById(id);

    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    // Delete the vehicle from database
    const deletedVehicle = await Vehicle.findByIdAndDelete(id);

    // If deletion from database is successful, delete the associated image file
    if (deletedVehicle) {
      const imagePath = vehicle.image;

      // Check if imagePath exists and delete the file
      if (imagePath) {
        fs.unlinkSync(path.join(__dirname, `../${imagePath}`));
      }

      return res.status(200).json({ message: 'Vehicle deleted successfully' });
    } else {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Export the multer upload function
exports.upload = upload;
