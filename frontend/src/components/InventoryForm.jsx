import React, { useState, useEffect } from 'react';

function InventoryForm({ onSubmit, initialData, onCancel }) {
  const [formData, setFormData] = useState({
    sku: '',
    name: '',
    description: '',
    quantity: 0,
    price: 0,
    category: 'Electronics'
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' || name === 'price' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onSubmit(formData);
      setFormData({
        sku: '',
        name: '',
        description: '',
        quantity: 0,
        price: 0,
        category: 'Electronics'
      });
    } catch (err) {
      console.error('Form submission error:', err);
    }
  };

  return (
    <div className="inventory-form">
      <h2>{initialData ? 'Edit Item' : 'Add New Item'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>SKU *</label>
            <input
              type="text"
              name="sku"
              value={formData.sku}
              onChange={handleChange}
              required
              placeholder="e.g., SKU-001"
            />
          </div>
          
          <div className="form-group">
            <label>Item Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="e.g., Laptop"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Item description..."
            rows="3"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Quantity *</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              required
              min="0"
            />
          </div>
          
          <div className="form-group">
            <label>Price ($) *</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
            />
          </div>
          
          <div className="form-group">
            <label>Category *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="Electronics">Electronics</option>
              <option value="Clothing">Clothing</option>
              <option value="Food">Food</option>
              <option value="Books">Books</option>
              <option value="Tools">Tools</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary">
            {initialData ? 'Update Item' : 'Add Item'}
          </button>
          {initialData && (
            <button type="button" onClick={onCancel} className="btn-secondary">
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default InventoryForm;