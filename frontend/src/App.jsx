import React, { useState, useEffect } from 'react';
import axios from 'axios';
import InventoryList from './components/InventoryList';
import InventoryForm from './components/InventoryForm';
import './App.css';

function App() {
  const [items, setItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/inventory`);
      setItems(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch inventory items');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (itemData) => {
    try {
      const response = await axios.post(`${API_URL}/inventory`, itemData);
      setItems([...items, response.data]);
      setError(null);
    } catch (err) {
      setError('Failed to create item');
      throw err;
    }
  };

  const handleUpdate = async (id, itemData) => {
    try {
      const response = await axios.put(`${API_URL}/inventory/${id}`, itemData);
      setItems(items.map(item => item._id === id ? response.data : item));
      setEditingItem(null);
      setError(null);
    } catch (err) {
      setError('Failed to update item');
      throw err;
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await axios.delete(`${API_URL}/inventory/${id}`);
        setItems(items.filter(item => item._id !== id));
        setError(null);
      } catch (err) {
        setError('Failed to delete item');
      }
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>📦 Inventory Management System</h1>
        <p>DevOps Pipeline Demo Project</p>
      </header>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="container">
        <InventoryForm 
          onSubmit={editingItem ? (data) => handleUpdate(editingItem._id, data) : handleCreate}
          initialData={editingItem}
          onCancel={() => setEditingItem(null)}
        />
        
        <InventoryList 
          items={items}
          loading={loading}
          onEdit={setEditingItem}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}

export default App;