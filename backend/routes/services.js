const express = require('express');
const router = express.Router();
const Service = require('../models/Service');

// Get all services
router.get('/', async (req, res) => {
  try {
    const services = await Service.find().sort({ serviceDate: -1 });
    res.json(services);
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ message: error.message, error: error.toString() });
  }
});

// Get services by customer ID
router.get('/customer/:customerId', async (req, res) => {
  try {
    const services = await Service.find({ customerId: req.params.customerId }).sort({ serviceDate: -1 });
    res.json(services);
  } catch (error) {
    console.error('Error fetching customer services:', error);
    res.status(500).json({ message: error.message, error: error.toString() });
  }
});

// Create service record
router.post('/', async (req, res) => {
  const service = new Service(req.body);
  try {
    const newService = await service.save();
    res.status(201).json(newService);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
