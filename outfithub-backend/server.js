const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 5000;
const JWT_SECRET = 'outfithub_secret_key_change_in_production';

// ─── Middleware ────────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ─── In-Memory Database (replace with MongoDB in production) ──────────────────
let users = [
  {
    _id: '1',
    name: 'Admin User',
    email: 'admin@outfithub.com',
    password: bcrypt.hashSync('admin123', 10),
    role: 'admin',
  },
  {
    _id: '2',
    name: 'John Doe',
    email: 'john@example.com',
    password: bcrypt.hashSync('user123', 10),
    role: 'user',
  },
];

let products = [
  {
    _id: '101',
    name: 'Classic White Oxford Shirt',
    price: 49.99,
    description: 'A crisp white Oxford shirt for every occasion.',
    category: 'Shirts',
    imageUrl: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400',
    stock: 20,
  },
  {
    _id: '102',
    name: 'Slim Fit Chinos',
    price: 64.99,
    description: 'Modern slim-fit chinos, perfect for casual and smart casual.',
    category: 'Pants',
    imageUrl: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400',
    stock: 15,
  },
  {
    _id: '103',
    name: 'Leather Biker Jacket',
    price: 149.99,
    description: 'Genuine leather jacket with a classic biker cut.',
    category: 'Jackets',
    imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400',
    stock: 8,
  },
  {
    _id: '104',
    name: 'Suede Chelsea Boots',
    price: 119.99,
    description: 'Premium suede Chelsea boots for sharp dressing.',
    category: 'Shoes',
    imageUrl: 'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=400',
    stock: 12,
  },
  {
    _id: '105',
    name: 'Minimalist Watch',
    price: 89.99,
    description: 'Clean and timeless minimalist wristwatch.',
    category: 'Accessories',
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
    stock: 30,
  },
  {
    _id: '106',
    name: 'Denim Jacket',
    price: 79.99,
    description: 'Classic stonewashed denim jacket.',
    category: 'Jackets',
    imageUrl: 'https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?w=400',
    stock: 10,
  },
];

let nextProductId = 200;
let nextUserId = 10;

// ─── Auth Middleware ───────────────────────────────────────────────────────────
const authenticate = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ message: 'No token provided' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

// ─── AUTH ROUTES ──────────────────────────────────────────────────────────────

// POST /api/auth/register
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const existingUser = users.find((u) => u.email === email);
  if (existingUser) {
    return res.status(409).json({ message: 'Email already registered' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = {
    _id: String(nextUserId++),
    name,
    email,
    password: hashedPassword,
    role: 'user',
  };

  users.push(newUser);
  return res.status(201).json({ message: 'Account created successfully' });
});

// POST /api/auth/login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const user = users.find((u) => u.email === email);
  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const token = jwt.sign(
    { userId: user._id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  return res.status(200).json({
    token,
    user: { _id: user._id, name: user.name, email: user.email, role: user.role },
  });
});

// ─── PRODUCT ROUTES ───────────────────────────────────────────────────────────

// GET /api/products — All users can see products
app.get('/api/products', authenticate, (req, res) => {
  const { category, search } = req.query;
  let result = [...products];

  if (category && category !== 'All') {
    result = result.filter(
      (p) => p.category.toLowerCase() === category.toLowerCase()
    );
  }

  if (search) {
    result = result.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase())
    );
  }

  return res.status(200).json({ products: result, total: result.length });
});

// GET /api/products/:id
app.get('/api/products/:id', authenticate, (req, res) => {
  const product = products.find((p) => p._id === req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  return res.status(200).json({ product });
});

// POST /api/products — Admin only
app.post('/api/products', authenticate, adminOnly, (req, res) => {
  const { name, price, description, category, imageUrl, stock } = req.body;

  if (!name || !price || !category) {
    return res.status(400).json({ message: 'Name, price, and category are required' });
  }

  const newProduct = {
    _id: String(nextProductId++),
    name,
    price: Number(price),
    description: description || '',
    category,
    imageUrl: imageUrl || '',
    stock: stock || 0,
  };

  products.push(newProduct);
  return res.status(201).json({ message: 'Product created', product: newProduct });
});

// PUT /api/products/:id — Admin only
app.put('/api/products/:id', authenticate, adminOnly, (req, res) => {
  const index = products.findIndex((p) => p._id === req.params.id);
  if (index === -1) return res.status(404).json({ message: 'Product not found' });

  const { name, price, description, category, imageUrl, stock } = req.body;

  products[index] = {
    ...products[index],
    name: name ?? products[index].name,
    price: price !== undefined ? Number(price) : products[index].price,
    description: description ?? products[index].description,
    category: category ?? products[index].category,
    imageUrl: imageUrl ?? products[index].imageUrl,
    stock: stock !== undefined ? Number(stock) : products[index].stock,
  };

  return res.status(200).json({ message: 'Product updated', product: products[index] });
});

// DELETE /api/products/:id — Admin only
app.delete('/api/products/:id', authenticate, adminOnly, (req, res) => {
  const index = products.findIndex((p) => p._id === req.params.id);
  if (index === -1) return res.status(404).json({ message: 'Product not found' });

  products.splice(index, 1);
  return res.status(200).json({ message: 'Product deleted' });
});

// ─── USERS ROUTE (Admin only) ─────────────────────────────────────────────────
app.get('/api/users', authenticate, adminOnly, (req, res) => {
  const safeUsers = users.map(({ password, ...u }) => u);
  return res.status(200).json({ users: safeUsers });
});

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ message: 'OutfitHub API is running 🚀', version: '1.0.0' });
});

// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 OutfitHub server running on http://localhost:${PORT}`);
  console.log(`\n📋 Test Credentials:`);
  console.log(`   Admin  → admin@outfithub.com / admin123`);
  console.log(`   User   → john@example.com / user123`);
  console.log(`\n📡 API Endpoints:`);
  console.log(`   POST   /api/auth/register`);
  console.log(`   POST   /api/auth/login`);
  console.log(`   GET    /api/products`);
  console.log(`   POST   /api/products  (admin)`);
  console.log(`   PUT    /api/products/:id  (admin)`);
  console.log(`   DELETE /api/products/:id  (admin)\n`);
});