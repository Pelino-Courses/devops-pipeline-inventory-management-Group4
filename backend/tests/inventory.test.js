const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/server');
const Inventory = require('../src/models/Inventory');

// Test database connection
beforeAll(async () => {
  const mongoURI = process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/inventory_test';
  await mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

// Clear database before each test
beforeEach(async () => {
  await Inventory.deleteMany({});
});

// Close database connection after all tests
afterAll(async () => {
  await mongoose.connection.close();
});

describe('Inventory API Tests', () => {
  
  // Test 1: Health Check
  describe('GET /health', () => {
    it('should return health status', async () => {
      const res = await request(app).get('/health');
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('status', 'UP');
      expect(res.body).toHaveProperty('timestamp');
    });
  });

  // Test 2: Get all inventory items (empty)
  describe('GET /api/inventory', () => {
    it('should return empty array when no items exist', async () => {
      const res = await request(app).get('/api/inventory');
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(0);
    });
  });

  // Test 3: Create new inventory item
  describe('POST /api/inventory', () => {
    it('should create a new inventory item', async () => {
      const newItem = {
        sku: 'TEST-001',
        name: 'Test Laptop',
        description: 'A test laptop for unit testing',
        quantity: 15,
        price: 999.99,
        category: 'Electronics'
      };

      const res = await request(app)
        .post('/api/inventory')
        .send(newItem);
      
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('_id');
      expect(res.body.sku).toBe('TEST-001');
      expect(res.body.name).toBe('Test Laptop');
      expect(res.body.quantity).toBe(15);
      expect(res.body.price).toBe(999.99);
    });

    it('should reject duplicate SKU', async () => {
      const item = {
        sku: 'DUPLICATE-001',
        name: 'Item 1',
        quantity: 10,
        price: 50,
        category: 'Other'
      };

      await request(app).post('/api/inventory').send(item);
      const res = await request(app).post('/api/inventory').send(item);
      
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('should reject invalid data', async () => {
      const invalidItem = {
        sku: 'INVALID-001',
        name: 'Test',
        quantity: -5, // Invalid: negative quantity
        price: 100,
        category: 'Electronics'
      };

      const res = await request(app)
        .post('/api/inventory')
        .send(invalidItem);
      
      expect(res.statusCode).toBe(400);
    });
  });

  // Test 4: Get single inventory item
  describe('GET /api/inventory/:id', () => {
    it('should return a single inventory item', async () => {
      const item = await Inventory.create({
        sku: 'GET-001',
        name: 'Test Item',
        quantity: 20,
        price: 75.50,
        category: 'Books'
      });

      const res = await request(app).get(`/api/inventory/${item._id}`);
      
      expect(res.statusCode).toBe(200);
      expect(res.body._id).toBe(item._id.toString());
      expect(res.body.name).toBe('Test Item');
    });

    it('should return 404 for non-existent item', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app).get(`/api/inventory/${fakeId}`);
      
      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('error');
    });
  });

  // Test 5: Update inventory item
  describe('PUT /api/inventory/:id', () => {
    it('should update an inventory item', async () => {
      const item = await Inventory.create({
        sku: 'UPDATE-001',
        name: 'Original Name',
        quantity: 10,
        price: 100,
        category: 'Tools'
      });

      const updates = {
        name: 'Updated Name',
        quantity: 25,
        price: 125.50
      };

      const res = await request(app)
        .put(`/api/inventory/${item._id}`)
        .send(updates);
      
      expect(res.statusCode).toBe(200);
      expect(res.body.name).toBe('Updated Name');
      expect(res.body.quantity).toBe(25);
      expect(res.body.price).toBe(125.50);
    });

    it('should return 404 for non-existent item', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .put(`/api/inventory/${fakeId}`)
        .send({ name: 'Test' });
      
      expect(res.statusCode).toBe(404);
    });
  });

  // Test 6: Delete inventory item
  describe('DELETE /api/inventory/:id', () => {
    it('should delete an inventory item', async () => {
      const item = await Inventory.create({
        sku: 'DELETE-001',
        name: 'To Be Deleted',
        quantity: 5,
        price: 50,
        category: 'Other'
      });

      const res = await request(app).delete(`/api/inventory/${item._id}`);
      
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('message');
      
      const checkItem = await Inventory.findById(item._id);
      expect(checkItem).toBeNull();
    });

    it('should return 404 for non-existent item', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app).delete(`/api/inventory/${fakeId}`);
      
      expect(res.statusCode).toBe(404);
    });
  });

  // Test 7: Filter by category
  describe('GET /api/inventory with filters', () => {
    beforeEach(async () => {
      await Inventory.create([
        { sku: 'ELEC-001', name: 'Item 1', quantity: 20, price: 100, category: 'Electronics' },
        { sku: 'ELEC-002', name: 'Item 2', quantity: 5, price: 200, category: 'Electronics' },
        { sku: 'BOOK-001', name: 'Item 3', quantity: 30, price: 15, category: 'Books' }
      ]);
    });

    it('should filter items by category', async () => {
      const res = await request(app).get('/api/inventory?category=Electronics');
      
      expect(res.statusCode).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.every(item => item.category === 'Electronics')).toBe(true);
    });

    it('should filter low stock items', async () => {
      const res = await request(app).get('/api/inventory?lowStock=true');
      
      expect(res.statusCode).toBe(200);
      expect(res.body.length).toBe(1);
      expect(res.body[0].quantity).toBeLessThan(10);
    });
  });

  // Test 8: Statistics endpoint
  describe('GET /api/inventory/stats/summary', () => {
    it('should return inventory statistics', async () => {
      await Inventory.create([
        { sku: 'STAT-001', name: 'Item 1', quantity: 20, price: 100, category: 'Electronics' },
        { sku: 'STAT-002', name: 'Item 2', quantity: 5, price: 50, category: 'Books' }
      ]);

      const res = await request(app).get('/api/inventory/stats/summary');
      
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('totalItems', 2);
      expect(res.body).toHaveProperty('lowStockItems', 1);
      expect(res.body).toHaveProperty('categoryStats');
    });
  });
});