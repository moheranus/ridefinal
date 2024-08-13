const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');

// Define routes
router.post('/, vehicleController.createVehicle');
router.get('/', vehicleController.getVehicles);
router.post('/', vehicleController.upload.single('image'), vehicleController.createVehicle);
router.put('/:id', vehicleController.upload.single('image'), vehicleController.updateVehicle);
router.delete('/:id', vehicleController.deleteVehicle);

module.exports = router;
