// app.js
const express = require('express');
const { MongoClient } = require('mongodb');
const path = require('path');

const app = express();
const url = 'mongodb://127.0.0.1:27017';
const client = new MongoClient(url);
const dbName = 'internshipDB';

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname));

let internshipCollection;

// Connect to MongoDB
client.connect().then(() => {
  const db = client.db(dbName);
  internshipCollection = db.collection('internships');
  console.log('✅ Connected to MongoDB');
}).catch(err => {
  console.error('❌ Connection error:', err);
});

// Serve HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '4b.html'));
});

// POST - Submit internship data
app.post('/submit', async (req, res) => {
  const { studentId, name, company, duration, status } = req.body;
  if (!studentId || !name || !company || !duration || !status) {
    return res.send('<h3>❌ All fields required.</h3><a href="/">Back</a>');
  }
  try {
    await internshipCollection.insertOne({ studentId, name, company, duration, status });
    res.send('<h3>✅ Internship submitted successfully.</h3><a href="/">Back</a>');
  } catch {
    res.status(500).send('<h3>❌ Error inserting data.</h3><a href="/">Back</a>');
  }
});

// PUT - Update internship status to "Completed"
app.put('/update', async (req, res) => {
  const { studentId } = req.body;
  try {
    const result = await internshipCollection.updateOne(
      { studentId },
      { $set: { status: 'Completed' } }
    );
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Student ID not found' });
    }
    res.json({ message: 'Status updated to Completed' });
  } catch {
    res.status(500).json({ error: 'Update failed' });
  }
});

// GET - Show all Infosys interns
app.get('/infosys', async (req, res) => {
  try {
    const results = await internshipCollection.find({ company: 'Infosys' }).toArray();
    res.json(results);
  } catch {
    res.status(500).json({ error: 'Failed to retrieve records' });
  }
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
