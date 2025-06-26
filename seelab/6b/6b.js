// app.js
const express = require('express');
const { MongoClient } = require('mongodb');
const path = require('path');

const app = express();
const url = 'mongodb://127.0.0.1:27017';
const client = new MongoClient(url);
const dbName = 'hospitalDB';

app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname)); // Serve static files like index.html

let hospitalCollection;

// Connect to MongoDB
client.connect().then(() => {
  const db = client.db(dbName);
  hospitalCollection = db.collection('hospitals');
  console.log('✅ Connected to MongoDB');
}).catch(err => {
  console.error('❌ MongoDB connection failed:', err);
});

// Serve the form
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '6b.html'));
});

// POST - Add hospital
app.post('/add', async (req, res) => {
  const { hospitalId, name, location, totalBeds, occupiedBeds } = req.body;

  if (!hospitalId || !name || !location || !totalBeds || occupiedBeds === '') {
    return res.send('<h3>❌ All fields are required.</h3><a href="/">Back</a>');
  }

  try {
    await hospitalCollection.insertOne({
      hospitalId,
      name,
      location,
      totalBeds: parseInt(totalBeds),
      occupiedBeds: parseInt(occupiedBeds)
    });
    res.send('<h3>✅ Hospital added successfully.</h3><a href="/">Back</a>');
  } catch (err) {
    res.status(500).send('<h3>❌ Error adding hospital.</h3><a href="/">Back</a>');
  }
});

// GET - Show hospitals with less than 10 available beds
app.get('/low-availability', async (req, res) => {
  try {
    const result = await hospitalCollection.find({
      $expr: { $lt: [{ $subtract: ["$totalBeds", "$occupiedBeds"] }, 10] }
    }).toArray();

    if (result.length === 0) {
      return res.send('<h3>📋 No hospitals with < 10 available beds.</h3><a href="/">Back</a>');
    }

    let html = '<h3>📋 Hospitals with < 10 Available Beds:</h3><ul>';
    result.forEach(h => {
      html += `<li><strong>${h.name}</strong> (${h.location}) — Available: ${h.totalBeds - h.occupiedBeds}</li>`;
    });
    html += '</ul><a href="/">Back</a>';
    res.send(html);
  } catch {
    res.status(500).send('<h3>❌ Error retrieving data.</h3><a href="/">Back</a>');
  }
});

// POST - Admit patient (increment occupied beds)
app.post('/admit', async (req, res) => {
  const { hospitalId } = req.body;

  try {
    const hospital = await hospitalCollection.findOne({ hospitalId });

    if (!hospital) {
      return res.send('<h3>❌ Hospital not found.</h3><a href="/">Back</a>');
    }

    if (hospital.occupiedBeds >= hospital.totalBeds) {
      return res.send('<h3>❌ No available beds in this hospital.</h3><a href="/">Back</a>');
    }

    await hospitalCollection.updateOne(
      { hospitalId },
      { $inc: { occupiedBeds: 1 } }
    );

    res.send('<h3>✅ Patient admitted successfully.</h3><a href="/">Back</a>');
  } catch {
    res.status(500).send('<h3>❌ Error admitting patient.</h3><a href="/">Back</a>');
  }
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
