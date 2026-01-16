require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { INITIAL_CONFIG, INITIAL_CATEGORIES, INITIAL_SOCIALS } = require('./data');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hylehub_local';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

// Middleware
app.use(cors());
app.use(express.json());

// --- MONGODB CONNECTION ---
// Added dbName option to ensure data goes to 'hylehub_store' even if connection string lacks path
mongoose.connect(MONGODB_URI, { dbName: 'hylehub_store' })
  .then(() => console.log('✅ Connected to MongoDB (Database: hylehub_store)'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// --- SCHEMAS ---
const SiteConfigSchema = new mongoose.Schema({
  siteName: String,
  tagline: String,
  bannerUrl: String,
  logoUrl: String,
  notices: [String],
  contactInfo: {
    email: String,
    phone: String,
    address: String
  }
});
const SiteConfig = mongoose.model('SiteConfig', SiteConfigSchema);

const CategorySchema = new mongoose.Schema({
  id: { type: String, unique: true }, // Keep string ID for frontend compatibility
  name: String,
  slug: String,
  order: Number,
  isVisible: Boolean,
  description: String
});
const Category = mongoose.model('Category', CategorySchema);

const SocialLinkSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  platform: String,
  url: String,
  iconName: String,
  handle: String,
  order: Number
});
const SocialLink = mongoose.model('SocialLink', SocialLinkSchema);

const ProductSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  name: String,
  slug: String,
  categoryId: String,
  status: { type: String, enum: ['published', 'draft', 'hidden'], default: 'draft' },
  thumbnailUrl: String,
  galleryUrls: [String],
  shortDescription: String,
  fullDescription: String,
  tags: [String],
  notes: String,
  priceOptions: [{
    id: String,
    name: String,
    price: Number,
    currency: String,
    unit: String,
    description: String,
    isHighlight: Boolean
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
const Product = mongoose.model('Product', ProductSchema);

// --- AUTH MIDDLEWARE (Simple Password Check) ---
const requireAdmin = (req, res, next) => {
  const authHeader = req.headers['x-admin-password'];
  if (authHeader === ADMIN_PASSWORD) {
    next();
  } else {
    res.status(403).json({ error: 'Unauthorized: Incorrect Admin Password' });
  }
};

// --- ROUTES ---

// 1. Config
app.get('/api/config', async (req, res) => {
  try {
    let config = await SiteConfig.findOne();
    if (!config) {
      config = await SiteConfig.create(INITIAL_CONFIG); // Seed if empty
    }
    res.json(config);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/config', requireAdmin, async (req, res) => {
  try {
    // Delete old config to ensure only one exists, or update existing
    await SiteConfig.deleteMany({});
    const newConfig = await SiteConfig.create(req.body);
    res.json(newConfig);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// 2. Categories
app.get('/api/categories', async (req, res) => {
  try {
    const cats = await Category.find().sort({ order: 1 });
    if (cats.length === 0) {
      // Seed
      await Category.insertMany(INITIAL_CATEGORIES);
      return res.json(INITIAL_CATEGORIES);
    }
    res.json(cats);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/categories', requireAdmin, async (req, res) => {
  try {
    const { id, ...data } = req.body;
    const cat = await Category.findOneAndUpdate({ id }, data, { upsert: true, new: true });
    res.json(cat);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// 3. Socials
app.get('/api/socials', async (req, res) => {
  try {
    const socials = await SocialLink.find().sort({ order: 1 });
    if (socials.length === 0) {
      await SocialLink.insertMany(INITIAL_SOCIALS);
      return res.json(INITIAL_SOCIALS);
    }
    res.json(socials);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/socials', requireAdmin, async (req, res) => {
  try {
    // Replace all socials strategy (simplest for list reordering)
    await SocialLink.deleteMany({});
    const newSocials = await SocialLink.insertMany(req.body);
    res.json(newSocials);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// 4. Products
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find().sort({ updatedAt: -1 });
    res.json(products);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/products', requireAdmin, async (req, res) => {
  try {
    const { id, ...data } = req.body;
    // Generate ID if new
    const finalId = id || Math.random().toString(36).substr(2, 9);
    
    const product = await Product.findOneAndUpdate(
      { id: finalId }, 
      { ...data, id: finalId, updatedAt: new Date() }, 
      { upsert: true, new: true }
    );
    res.json(product);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete('/api/products/:id', requireAdmin, async (req, res) => {
  try {
    await Product.findOneAndDelete({ id: req.params.id });
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// 5. Auth Check (Helper)
app.post('/api/auth/login', (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    res.json({ success: true });
  } else {
    res.status(401).json({ success: false, message: 'Sai mật khẩu' });
  }
});

// Health check
app.get('/', (req, res) => {
  res.send('HyleHub Backend API (MongoDB) is running.');
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});