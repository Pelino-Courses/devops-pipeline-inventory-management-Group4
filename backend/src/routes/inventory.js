const express = require('express');
const router = express.Router();
const Inventory = require('../models/Inventory');

// GET all inventory items
router.get('/', async (req, res) => {
  try {
    const { category, lowStock, sortBy = 'createdAt', order = 'desc' } = req.query;
    
    let query = {};
    
    if (category) {
      query.category = category;
    }
    
    if (lowStock === 'true') {
      query.quantity = { $lt: 10 };
    }
    
    const sortOrder = order === 'asc' ? 1 : -1;
    
    const items = await Inventory.find(query).sort({ [sortBy]: sortOrder });
    
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single inventory item by ID
router.get('/:id', async (req, res) => {
  try {
    const item = await Inventory.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    res.json(item);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.status(500).json({ error: error.message });
  }
});

// POST create new inventory item
router.post('/', async (req, res) => {
  try {
    const { sku, name, description, quantity, price, category } = req.body;
    
    // Check if SKU already exists
    const existingItem = await Inventory.findOne({ sku: sku.toUpperCase() });
    if (existingItem) {
      return res.status(400).json({ error: 'SKU already exists' });
    }
    
    const newItem = new Inventory({
      sku,
      name,
      description,
      quantity,
      price,
      category
    });
    
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
});

// PUT update inventory item
router.put('/:id', async (req, res) => {
  try {
    const { sku, name, description, quantity, price, category } = req.body;
    
    // If SKU is being updated, check for duplicates
    if (sku) {
      const existingItem = await Inventory.findOne({ 
        sku: sku.toUpperCase(), 
        _id: { $ne: req.params.id } 
      });
      if (existingItem) {
        return res.status(400).json({ error: 'SKU already exists' });
      }
    }
    
    const updatedItem = await Inventory.findByIdAndUpdate(
      req.params.id,
      { sku, name, description, quantity, price, category, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    
    if (!updatedItem) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    res.json(updatedItem);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.status(500).json({ error: error.message });
  }
});

// DELETE inventory item
router.delete('/:id', async (req, res) => {
  try {
    const deletedItem = await Inventory.findByIdAndDelete(req.params.id);
    
    if (!deletedItem) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    res.json({ message: 'Item deleted successfully', item: deletedItem });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.status(500).json({ error: error.message });
  }
});

// GET inventory statistics
router.get('/stats/summary', async (req, res) => {
  try {
    const totalItems = await Inventory.countDocuments();
    const lowStockItems = await Inventory.countDocuments({ quantity: { $lt: 10 } });
    const categoryStats = await Inventory.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalValue: { $sum: { $multiply: ['$quantity', '$price'] } }
        }
      }
    ]);
    
    res.json({
      totalItems,
      lowStockItems,
      categoryStats
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;