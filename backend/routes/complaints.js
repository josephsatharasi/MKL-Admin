const express = require('express');
const router = express.Router();
const Complaint = require('../models/Complaint');
const Customer = require('../models/Customer');

// Get all complaints
router.get('/', async (req, res) => {
  try {
    const complaints = await Complaint.find().sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create complaint
router.post('/', async (req, res) => {
  try {
    const { customerName, subject, body } = req.body;
    
    // Verify customer exists
    const customer = await Customer.findOne({ name: { $regex: new RegExp(`^${customerName}$`, 'i') } });
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found in the system' });
    }

    const complaint = new Complaint({ customerName, subject, body });
    await complaint.save();
    res.status(201).json(complaint);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update complaint status
router.patch('/:id', async (req, res) => {
  try {
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(complaint);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete complaint
router.delete('/:id', async (req, res) => {
  try {
    await Complaint.findByIdAndDelete(req.params.id);
    res.json({ message: 'Complaint deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
