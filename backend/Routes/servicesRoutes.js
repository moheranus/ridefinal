const express = require('express');
const router = express.Router();
const servicesController = require('../controllers/servicesController');

router.get('/services', servicesController.getServices);
router.post('/services', servicesController.createService);
router.put('/services/:id', servicesController.updateService);
router.delete('/services/:id', servicesController.deleteService);

module.exports = router;
