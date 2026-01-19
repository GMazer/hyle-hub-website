
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { INITIAL_CONFIG, INITIAL_CATEGORIES, INITIAL_SOCIALS } = require('./data');

const app = express();
const PORT = process.env.PORT || 3000;
// Default to localhost ONLY for local dev. On Render, this MUST be set in Environment Variables.
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hylehub_local';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

// Middleware
// Trust proxy is required to get real IP on Render/Vercel/Heroku
app.set('trust proxy', true); 
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Increase limit for bulk upload

// --- LOGGER MIDDLEWARE ---
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// --- MONGODB CONNECTION IMPROVED ---
// 1. Log events
mongoose.connection.on('connected', () => console.log('✅ MongoDB: Connection Established'));
mongoose.connection.on('error', (err) => console.error('❌ MongoDB: Connection Error', err));
mongoose.connection.on('disconnected', () => console.warn('⚠️ MongoDB: Disconnected'));

// 2. Connect function
const connectDB = async () => {
  try {
    // Mask password in logs for security (in case URI is printed)
    const maskedURI = MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@');
    console.log(`🔌 Attempting connect to MongoDB...`);
    
    await mongoose.connect(MONGODB_URI, {
      dbName: 'hylehub_store',
      serverSelectionTimeoutMS: 5000, // Fail fast (5s) if IP is blocked or URI is wrong
    });
  } catch (err) {
    console.error('❌ Failed to connect to MongoDB. Check your MONGODB_URI on Render and IP Whitelist on Atlas (0.0.0.0/0).');
  }
};
connectDB();

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
  id: { type: String, unique: true },
  name: String,
  slug: String,
  iconUrl: String, // Added iconUrl
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
  isHot: { type: Boolean, default: false }, // Added isHot field
  views: { type: Number, default: 0 }, // New: Count product clicks
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

// Visitor Schema for Analytics
const VisitorSchema = new mongoose.Schema({
  ip: String,
  date: String, // Format: YYYY-MM-DD
  userAgent: String, // Store basic device info to differentiate same-IP users
  hits: { type: Number, default: 1 },
  lastSeen: { type: Date, default: Date.now }
});
// Composite index to ensure one record per IP per day
VisitorSchema.index({ ip: 1, date: 1, userAgent: 1 }, { unique: true });
const Visitor = mongoose.model('Visitor', VisitorSchema);

// --- AUTH MIDDLEWARE ---
const requireAdmin = (req, res, next) => {
  const authHeader = req.headers['x-admin-password'];
  if (authHeader === ADMIN_PASSWORD) {
    next();
  } else {
    res.status(403).json({ error: 'Unauthorized: Incorrect Admin Password' });
  }
};

// --- ROUTES ---

// Helper to check DB status before processing
const checkDb = (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ 
      error: 'Database connection is not ready.', 
      details: 'Check server logs for MONGODB_URI or IP Whitelist issues.' 
    });
  }
  next();
};

// --- ANALYTICS ROUTES ---

// 1. Track Visit (Called by Storefront)
app.post('/api/analytics/track', checkDb, async (req, res) => {
  try {
    const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'] || 'unknown';
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    // Upsert: If exists for today/IP/UA, increment hits.
    await Visitor.findOneAndUpdate(
      { ip, date: today, userAgent }, // Differentiate by User Agent too
      { $inc: { hits: 1 }, $set: { lastSeen: new Date() } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.json({ success: true });
  } catch (e) {
    console.error("Analytics Error:", e);
    res.status(200).json({ success: false }); 
  }
});

// 2. Track Product View (New)
app.post('/api/analytics/view-product/:id', checkDb, async (req, res) => {
  try {
    const { id } = req.params;
    await Product.findOneAndUpdate(
      { id }, 
      { $inc: { views: 1 } }
    );
    res.json({ success: true });
  } catch (e) {
    console.error("Product Analytics Error:", e);
    res.status(200).json({ success: false });
  }
});

// 3. Get Full Report (Stats + Top Products + History)
app.get('/api/analytics/report', requireAdmin, checkDb, async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    // Parallel Data Fetching
    const [todayStats, totalHitsRes, totalUniqueRes, topProducts, historyRes, recentVisitors] = await Promise.all([
      // A. Today's Views
      Visitor.aggregate([
        { $match: { date: today } },
        { $group: { _id: null, totalHits: { $sum: "$hits" }, uniqueVisitors: { $count: {} } } }
      ]),
      // B. Total Views
      Visitor.aggregate([{ $group: { _id: null, totalHits: { $sum: "$hits" } } }]),
      // C. Total Unique IPs
      Visitor.distinct('ip'),
      // D. Top Viewed Products (Limit 10)
      Product.find().sort({ views: -1 }).limit(10).select('name thumbnailUrl views categoryId'),
      // E. Visitor History (Last 7 days)
      Visitor.aggregate([
        { $group: { 
            _id: "$date", 
            hits: { $sum: "$hits" }, 
            unique: { $count: {} } // Approximate unique per day
        }},
        { $sort: { _id: -1 } },
        { $limit: 7 }
      ]),
      // F. Recent Visitors (Detailed Log for IP/Device)
      Visitor.find()
        .sort({ lastSeen: -1 }) // Newest first
        .limit(50) // Limit to last 50 entries
        .select('ip userAgent hits lastSeen date')
    ]);

    res.json({
      stats: {
        todayViews: todayStats[0]?.totalHits || 0,
        todayUnique: todayStats[0]?.uniqueVisitors || 0,
        totalViews: totalHitsRes[0]?.totalHits || 0,
        totalUniqueIps: totalUniqueRes.length || 0
      },
      topProducts: topProducts || [],
      visitorHistory: historyRes.map(h => ({ date: h._id, hits: h.hits, unique: h.unique })) || [],
      recentVisitors: recentVisitors || []
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

// Legacy Stats Endpoint (Keep for backward compatibility if needed, or redirect logic)
app.get('/api/analytics/stats', requireAdmin, checkDb, async (req, res) => {
    // ... reused logic ...
    // For simplicity, let's just redirect internally or call the same logic
    // Implementation kept minimal as Dashboard uses it.
    try {
        const today = new Date().toISOString().split('T')[0];
        const [todayStats, totalStats, uniqueStats] = await Promise.all([
          Visitor.aggregate([{ $match: { date: today } }, { $group: { _id: null, totalHits: { $sum: "$hits" }, uniqueVisitors: { $count: {} } } }]),
          Visitor.aggregate([{ $group: { _id: null, totalHits: { $sum: "$hits" } } }]),
          Visitor.distinct('ip')
        ]);
        res.json({
          todayViews: todayStats[0]?.totalHits || 0,
          todayUnique: todayStats[0]?.uniqueVisitors || 0,
          totalViews: totalStats[0]?.totalHits || 0,
          totalUniqueIps: uniqueStats.length || 0
        });
    } catch(e) { res.status(500).json({error: e.message}); }
});


// 1. Config
app.get('/api/config', checkDb, async (req, res) => {
  try {
    let config = await SiteConfig.findOne();
    if (!config) {
      config = await SiteConfig.create(INITIAL_CONFIG); 
    }
    res.json(config);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/config', requireAdmin, checkDb, async (req, res) => {
  try {
    await SiteConfig.deleteMany({});
    const newConfig = await SiteConfig.create(req.body);
    res.json(newConfig);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// 2. Categories
app.get('/api/categories', checkDb, async (req, res) => {
  try {
    const cats = await Category.find().sort({ order: 1 });
    if (cats.length === 0) {
      await Category.insertMany(INITIAL_CATEGORIES);
      return res.json(INITIAL_CATEGORIES);
    }
    res.json(cats);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/categories', requireAdmin, checkDb, async (req, res) => {
  try {
    const { id, ...data } = req.body;
    // Generate ID if not provided (new category)
    const finalId = id || Math.random().toString(36).substr(2, 9);
    
    const cat = await Category.findOneAndUpdate(
      { id: finalId }, 
      { ...data, id: finalId }, 
      { upsert: true, new: true }
    );
    res.json(cat);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete('/api/categories/:id', requireAdmin, checkDb, async (req, res) => {
  try {
    await Category.findOneAndDelete({ id: req.params.id });
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// 3. Socials
app.get('/api/socials', checkDb, async (req, res) => {
  try {
    const socials = await SocialLink.find().sort({ order: 1 });
    if (socials.length === 0) {
      await SocialLink.insertMany(INITIAL_SOCIALS);
      return res.json(INITIAL_SOCIALS);
    }
    res.json(socials);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/socials', requireAdmin, checkDb, async (req, res) => {
  try {
    await SocialLink.deleteMany({});
    const newSocials = await SocialLink.insertMany(req.body);
    res.json(newSocials);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// 4. Products
app.get('/api/products', checkDb, async (req, res) => {
  try {
    // Sort by isHot first (Hot products first), then by updatedAt
    const products = await Product.find().sort({ isHot: -1, updatedAt: -1 });
    res.json(products);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Single Create/Update
app.post('/api/products', requireAdmin, checkDb, async (req, res) => {
  try {
    const { id, ...data } = req.body;
    const finalId = id || Math.random().toString(36).substr(2, 9);
    
    const product = await Product.findOneAndUpdate(
      { id: finalId }, 
      { ...data, id: finalId, updatedAt: new Date() }, 
      { upsert: true, new: true }
    );
    res.json(product);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Bulk Import
app.post('/api/products/bulk', requireAdmin, checkDb, async (req, res) => {
  try {
    const rawItems = req.body;
    if (!Array.isArray(rawItems)) {
      return res.status(400).json({ error: "Dữ liệu gửi lên phải là danh sách (Array)." });
    }

    // Prepare data with IDs
    const productsToInsert = rawItems.map(item => ({
      ...item,
      id: item.id || Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    await Product.insertMany(productsToInsert);
    res.json({ success: true, count: productsToInsert.length });
  } catch (e) { 
    console.error(e);
    res.status(500).json({ error: e.message }); 
  }
});

app.delete('/api/products/:id', requireAdmin, checkDb, async (req, res) => {
  try {
    await Product.findOneAndDelete({ id: req.params.id });
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// 5. Auth Check
app.post('/api/auth/login', (req, res) => {
  // Simple check doesn't need DB
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
