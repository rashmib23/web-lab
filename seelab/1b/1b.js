// app.js
const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();

const url = 'mongodb://127.0.0.1:27017'; // IPv4 preferred
const client = new MongoClient(url);
const dbName = 'complaintDB';

app.use(express.json()); // For parsing JSON in requests

let complaintsCollection;

// Connect to MongoDB
client.connect().then(() => {
  const db = client.db(dbName);
  complaintsCollection = db.collection('complaints');
  console.log('✅ Connected to MongoDB');
}).catch(err => {
  console.error('❌ Connection failed:', err);
});

// POST - Submit a new complaint
app.post('/complaints', async (req, res) => {
  const { complaintId, userName, issue, status } = req.body;
  if (!complaintId || !userName || !issue || !status) {
    return res.status(400).json({ error: 'All fields are required.' });
  }
  try {
    const result = await complaintsCollection.insertOne({ complaintId, userName, issue, status });
    res.status(201).json({ message: 'Complaint submitted', id: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: 'Submission failed' });
  }
});

// PUT - Update complaint status
app.put('/complaints/:id', async (req, res) => {
  const complaintId = req.params.id;
  const { status } = req.body;
  try {
    const result = await complaintsCollection.updateOne(
      { complaintId },
      { $set: { status } }
    );
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Complaint not found' });
    }
    res.json({ message: 'Status updated' });
  } catch (err) {
    res.status(500).json({ error: 'Update failed' });
  }
});

// GET - Retrieve pending complaints
app.get('/complaints/pending', async (req, res) => {
  try {
    const complaints = await complaintsCollection.find({ status: 'Pending' }).toArray();
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch complaints' });
  }
});

const path = require('path');

// Serve 1b.html at the root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '1b.html'));
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
