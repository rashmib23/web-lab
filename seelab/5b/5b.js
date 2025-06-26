// app.js
const express = require('express');
const { MongoClient } = require('mongodb');
const path = require('path');

const app = express();
const url = 'mongodb://127.0.0.1:27017';
const client = new MongoClient(url);
const dbName = 'studentDB';

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname)); // to serve index.html

let studentCollection;

client.connect().then(() => {
  const db = client.db(dbName);
  studentCollection = db.collection('students');
  console.log('✅ Connected to MongoDB');
}).catch(err => {
  console.error('❌ Connection error:', err);
});

// Serve the HTML form
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '5b.html'));
});

// POST - Add student
app.post('/submit', async (req, res) => {
  const { name, usn, department, grade } = req.body;
  if (!name || !usn || !department || !grade) {
    return res.send('<h3>❌ All fields required.</h3><a href="/">Back</a>');
  }
  try {
    await studentCollection.insertOne({ name, usn, department, grade });
    res.send('<h3>✅ Student record added.</h3><a href="/">Back</a>');
  } catch {
    res.status(500).send('<h3>❌ Error inserting data.</h3><a href="/">Back</a>');
  }
});

// PUT - Update grade by Name
app.put('/update-grade', async (req, res) => {
  const { name, grade } = req.body;
  try {
    const result = await studentCollection.updateOne(
      { name },
      { $set: { grade } }
    );
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.json({ message: '✅ Grade updated successfully' });
  } catch {
    res.status(500).json({ error: 'Update failed' });
  }
});

// GET - All student records
app.get('/students', async (req, res) => {
  try {
    const records = await studentCollection.find().toArray();
    res.json(records);
  } catch {
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
