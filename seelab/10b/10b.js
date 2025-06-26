const express = require('express');
const { MongoClient } = require('mongodb');
const path = require('path');

const app = express();
const url = 'mongodb://127.0.0.1:27017';
const client = new MongoClient(url);
const dbName = 'startupDB';

app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname)); // Serve index.html

let startupCollection;

client.connect().then(() => {
  const db = client.db(dbName);
  startupCollection = db.collection('ideas');
  console.log('✅ Connected to MongoDB');
}).catch(err => {
  console.error('❌ MongoDB connection failed:', err);
});

// Serve HTML form
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '10b.html'));
});

// POST - Submit new startup idea
app.post('/submit', async (req, res) => {
  const { id, teamName, title, domain, funding } = req.body;

  if (!id || !teamName || !title || !domain || !funding) {
    return res.send('<h3>❌ All fields are required.</h3><a href="/">Back</a>');
  }

  try {
    const fundingAmount = parseFloat(funding);
    await startupCollection.insertOne({ id, teamName, title, domain, funding: fundingAmount });
    res.send('<h3>✅ Startup idea recorded successfully.</h3><a href="/">Back</a>');
  } catch (err) {
    res.status(500).send('<h3>❌ Error saving startup idea.</h3><a href="/">Back</a>');
  }
});

// GET - Display EdTech startups needing > 5 lakh funding
app.get('/filter', async (req, res) => {
  try {
    const results = await startupCollection.find({
      domain: 'EdTech',
      funding: { $gt: 500000 }
    }).toArray();

    if (results.length === 0) {
      return res.send('<h3>📄 No EdTech startups needing > ₹5 lakh funding found.</h3><a href="/">Back</a>');
    }

    let html = '<h3>📄 EdTech Startups Needing > ₹5 Lakh Funding:</h3><ul>';
    results.forEach(s => {
      html += `<li><strong>${s.title}</strong> (Team: ${s.teamName}) - ₹${s.funding}</li>`;
    });
    html += '</ul><a href="/">Back</a>';
    res.send(html);
  } catch {
    res.status(500).send('<h3>❌ Error fetching startup data.</h3><a href="/">Back</a>');
  }
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
