const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  sku: {
    type: String,
    required: [true, 'SKU is required'],
    unique: true,
    trim: true,
    uppercase: true,
    index: true
  },
  name: {
    type: String,
    required: [true, 'Item name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [0, 'Quantity cannot be negative'],
    default: 0
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: {
      values: ['Electronics', 'Clothing', 'Food', 'Books', 'Tools', 'Other'],
      message: '{VALUE} is not a valid category'
    },
    default: 'Other'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster queries
inventorySchema.index({ category: 1, quantity: 1 });

// Virtual for low stock warning
inventorySchema.virtual('isLowStock').get(function() {
  return this.quantity < 10;
});

// Pre-save middleware to update timestamps
inventorySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Method to calculate total value
inventorySchema.methods.getTotalValue = function() {
  return this.quantity * this.price;
};

module.exports = mongoose.model('Inventory', inventorySchema);