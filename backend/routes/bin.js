const express = require('express');
const router = express.Router();
const DeletedCustomer = require('../models/DeletedCustomer');

// Get all deleted customers
router.get('/', async (req, res) => {
  try {
    console.log('Fetching deleted customers...');
    const deletedCustomers = await DeletedCustomer.find().sort({ deletedAt: -1 });
    console.log('Found deleted customers:', deletedCustomers.length);
    res.json(deletedCustomers);
  } catch (error) {
    console.error('Error fetching deleted customers:', error);
    res.status(500).json({ message: error.message });
  }
});

// Restore deleted customer
router.post('/restore/:id', async (req, res) => {
  try {
    const deletedCustomer = await DeletedCustomer.findById(req.params.id);
    if (!deletedCustomer) return res.status(404).json({ message: 'Customer not found in bin' });
    
    const Customer = require('../models/Customer');
    const restoredCustomer = new Customer({
      name: deletedCustomer.name,
      phone: deletedCustomer.phone,
      address: deletedCustomer.address,
      area: deletedCustomer.area,
      service: deletedCustomer.service,
      brand: deletedCustomer.brand,
      createdAt: deletedCustomer.createdAt
    });
    
    await restoredCustomer.save();
    await DeletedCustomer.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Customer restored successfully', customer: restoredCustomer });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Permanently delete
router.delete('/:id', async (req, res) => {
  try {
    const deletedCustomer = await DeletedCustomer.findByIdAndDelete(req.params.id);
    if (!deletedCustomer) return res.status(404).json({ message: 'Customer not found' });
    res.json({ message: 'Customer permanently deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
