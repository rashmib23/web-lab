// app.js
const express = require('express');
const { MongoClient } = require('mongodb');
const path = require('path');

const app = express();
const url = 'mongodb://127.0.0.1:27017';
const client = new MongoClient(url);
const dbName = 'productDB';

app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

let productCollection;

// Connect to MongoDB
client.connect().then(() => {
  const db = client.db(dbName);
  productCollection = db.collection('products');
  console.log('✅ Connected to MongoDB');
}).catch(err => {
  console.error('❌ MongoDB connection error:', err);
});

// Serve HTML form
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '8b.html'));
});

// POST - Add product with Final Price calculation
app.post('/add-product', async (req, res) => {
  const { productId, name, price, discount, stock } = req.body;

  if (!productId || !name || !price || !discount || !stock) {
    return res.send('<h3>❌ All fields are required.</h3><a href="/">Back</a>');
  }

  const numericPrice = parseFloat(price);
  const numericDiscount = parseFloat(discount);
  const finalPrice = numericPrice - (numericPrice * numericDiscount / 100);

  const product = {
    productId,
    name,
    price: numericPrice,
    discount: numericDiscount,
    stock: parseInt(stock),
    finalPrice: parseFloat(finalPrice.toFixed(2))
  };

  try {
    await productCollection.insertOne(product);
    res.send('<h3>✅ Product added successfully with final price.</h3><a href="/">Back</a>');
  } catch (err) {
    res.status(500).send('<h3>❌ Failed to insert product.</h3><a href="/">Back</a>');
  }
});

// GET - Products with final price < 1000
app.get('/low-price-products', async (req, res) => {
  try {
    const products = await productCollection.find({ finalPrice: { $lt: 1000 } }).toArray();
    if (products.length === 0) {
      return res.send('<h3>📦 No products found with final price below ₹1000.</h3><a href="/">Back</a>');
    }

    let html = '<h3>📦 Products with Final Price < ₹1000:</h3><ul>';
    products.forEach(p => {
      html += `<li>${p.name} - Final Price: ₹${p.finalPrice}</li>`;
    });
    html += '</ul><a href="/">Back</a>';
    res.send(html);
  } catch (err) {
    res.status(500).send('<h3>❌ Error fetching products.</h3><a href="/">Back</a>');
  }
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
