const express = require('express');
const router = express.Router();
const Service = require('../models/Service');

// Get all services
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 100;
    const skip = (page - 1) * limit;
    
    const services = await Service.find()
      .sort({ serviceDate: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    
    const total = await Service.countDocuments();
    
    res.json({
      services,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ message: error.message, error: error.toString() });
  }
});

// Get count of unique customers with services
router.get('/stats/customer-count', async (req, res) => {
  try {
    const uniqueCustomers = await Service.distinct('customerId');
    res.json({ count: uniqueCustomers.length });
  } catch (error) {
    console.error('Error fetching customer count:', error);
    res.status(500).json({ message: error.message, error: error.toString() });
  }
});

// Get latest service date for all customers (optimized)
router.get('/stats/latest-dates', async (req, res) => {
  try {
    const services = await Service.aggregate([
      {
        $sort: { serviceDate: -1 }
      },
      {
        $group: {
          _id: '$customerId',
          latestServiceDate: { $first: '$serviceDate' }
        }
      }
    ]);
    
    // Convert to object format { customerId: date }
    const dateMap = {};
    services.forEach(service => {
      dateMap[service._id] = service.latestServiceDate;
    });
    
    res.json(dateMap);
  } catch (error) {
    console.error('Error fetching latest service dates:', error);
    res.status(500).json({ message: error.message, error: error.toString() });
  }
});

// Get services by customer ID
router.get('/customer/:customerId', async (req, res) => {
  try {
    const services = await Service.find({ customerId: req.params.customerId })
      .sort({ serviceDate: -1 })
      .limit(100)
      .lean();
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

// Update service record
router.put('/:id', async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!service) return res.status(404).json({ message: 'Service not found' });
    res.json(service);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete service record
router.delete('/:id', async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) return res.status(404).json({ message: 'Service not found' });
    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
