import React from 'react';

function InventoryList({ items, loading, onEdit, onDelete }) {
  if (loading) {
    return <div className="loading">Loading inventory...</div>;
  }

  if (items.length === 0) {
    return <div className="empty-state">No items in inventory. Add your first item!</div>;
  }

  return (
    <div className="inventory-list">
      <h2>Inventory Items ({items.length})</h2>
      <table>
        <thead>
          <tr>
            <th>SKU</th>
            <th>Name</th>
            <th>Description</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item._id} className={item.quantity < 10 ? 'low-stock' : ''}>
              <td>{item.sku}</td>
              <td>{item.name}</td>
              <td>{item.description}</td>
              <td>
                {item.quantity}
                {item.quantity < 10 && <span className="badge">Low Stock</span>}
              </td>
              <td>${item.price.toFixed(2)}</td>
              <td>{item.category}</td>
              <td className="actions">
                <button onClick={() => onEdit(item)} className="btn-edit">Edit</button>
                <button onClick={() => onDelete(item._id)} className="btn-delete">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default InventoryList;