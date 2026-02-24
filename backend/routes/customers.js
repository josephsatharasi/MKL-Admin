const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');

// Get all customers
router.get('/', async (req, res) => {
  try {
    // Option to exclude images for faster loading
    const excludeImages = req.query.excludeImages === 'true';
    
    const selectFields = excludeImages 
      ? '-profilePic -additionalPics -__v' 
      : '-__v';
    
    const customers = await Customer.find()
      .select(selectFields) // Exclude images if requested
      .sort({ createdAt: -1 })
      .lean(); // Convert to plain JavaScript objects for better performance
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get customers by name (search)
router.get('/search/:name', async (req, res) => {
  try {
    const customers = await Customer.find({ 
      name: { $regex: req.params.name, $options: 'i' } 
    }).sort({ createdAt: -1 });
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single customer
router.get('/:id', async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create customer
router.post('/', async (req, res) => {
  console.log('Received customer data:', {
    name: req.body.name,
    hasProfilePic: !!req.body.profilePic,
    additionalPicsCount: req.body.additionalPics?.length || 0
  });
  const customer = new Customer(req.body);
  try {
    const newCustomer = await customer.save();
    console.log('Saved customer:', {
      id: newCustomer._id,
      hasProfilePic: !!newCustomer.profilePic,
      additionalPicsCount: newCustomer.additionalPics?.length || 0
    });
    res.status(201).json(newCustomer);
  } catch (error) {
    console.error('Error saving customer:', error.message);
    res.status(400).json({ message: error.message });
  }
});

// Update customer
router.put('/:id', async (req, res) => {
  try {
    const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    res.json(customer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update follow-up status
router.patch('/:id/status', async (req, res) => {
  try {
    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      { followUpStatus: req.body.status },
      { new: true }
    );
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    res.json(customer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete customer (move to bin)
router.delete('/:id', async (req, res) => {
  try {
    console.log('Deleting customer with ID:', req.params.id);
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      console.log('Customer not found');
      return res.status(404).json({ message: 'Customer not found' });
    }
    
    console.log('Customer found:', customer.name);
    
    // Save to DeletedCustomer collection
    const DeletedCustomer = require('../models/DeletedCustomer');
    const deletedCustomer = new DeletedCustomer({
      name: customer.name,
      phone: customer.phone,
      email: customer.email,
      address: customer.address,
      area: customer.area,
      service: customer.service,
      brand: customer.brand,
      originalId: customer._id.toString(),
      createdAt: customer.createdAt
    });
    
    await deletedCustomer.save();
    console.log('Saved to bin:', deletedCustomer._id);
    
    await Customer.findByIdAndDelete(req.params.id);
    console.log('Deleted from customers');
    
    res.json({ message: 'Customer moved to bin' });
  } catch (error) {
    console.error('Error deleting customer:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
