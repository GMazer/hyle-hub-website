const express = require('express');
const cors = require('cors');
const { INITIAL_CONFIG, INITIAL_CATEGORIES, INITIAL_PRODUCTS, INITIAL_SOCIALS } = require('./data');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// In-memory database (reset on restart)
// For production persistence, connect to MongoDB/Postgres here.
let db = {
  config: INITIAL_CONFIG,
  categories: INITIAL_CATEGORIES,
  products: INITIAL_PRODUCTS,
  socials: INITIAL_SOCIALS
};

// --- ROUTES ---

// Config
app.get('/api/config', (req, res) => res.json(db.config));
app.post('/api/config', (req, res) => {
  db.config = req.body;
  res.json(db.config);
});

// Categories
app.get('/api/categories', (req, res) => res.json(db.categories));
app.post('/api/categories', (req, res) => {
  const category = req.body;
  const index = db.categories.findIndex(c => c.id === category.id);
  if (index >= 0) {
    db.categories[index] = category;
  } else {
    db.categories.push({ ...category, id: Math.random().toString(36).substr(2, 9) });
  }
  res.json(category);
});
app.delete('/api/categories/:id', (req, res) => {
  db.categories = db.categories.filter(c => c.id !== req.params.id);
  res.json({ success: true });
});

// Products
app.get('/api/products', (req, res) => res.json(db.products));
app.post('/api/products', (req, res) => {
  const product = req.body;
  const index = db.products.findIndex(p => p.id === product.id);
  const now = new Date().toISOString();
  
  if (index >= 0) {
    db.products[index] = { ...product, updatedAt: now };
    res.json(db.products[index]);
  } else {
    const newProduct = { 
      ...product, 
      id: Math.random().toString(36).substr(2, 9),
      createdAt: now,
      updatedAt: now
    };
    db.products.push(newProduct);
    res.json(newProduct);
  }
});
app.delete('/api/products/:id', (req, res) => {
  db.products = db.products.filter(p => p.id !== req.params.id);
  res.json({ success: true });
});

// Socials
app.get('/api/socials', (req, res) => res.json(db.socials));
app.post('/api/socials', (req, res) => {
  db.socials = req.body;
  res.json(db.socials);
});

// Root
app.get('/', (req, res) => {
  res.send('HyleHub Backend API is running.');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});