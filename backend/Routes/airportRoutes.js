const express = require('express');
const router = express.Router();
const airportController = require('../controllers/airportController');

router.get('/', airportController.getAirports);
router.post('/', airportController.addAirport);
router.put('/:id', airportController.updateAirport);
router.delete('/:id', airportController.deleteAirport);

module.exports = router;
