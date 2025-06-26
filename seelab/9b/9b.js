const express = require('express');
const { MongoClient } = require('mongodb');
const path = require('path');

const app = express();
const url = 'mongodb://127.0.0.1:27017';
const client = new MongoClient(url);
const dbName = 'studentDB';

app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

let studentCollection;

// MongoDB connection
client.connect().then(() => {
  const db = client.db(dbName);
  studentCollection = db.collection('students');
  console.log('✅ Connected to MongoDB');
}).catch(err => {
  console.error('❌ MongoDB connection error:', err);
});

// Serve HTML form
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '9b.html'));
});

// POST - Submit student
app.post('/submit', async (req, res) => {
  const { userName, branch, semester } = req.body;

  if (!userName || !branch || !semester) {
    return res.send('<h3>❌ All fields are required.</h3><a href="/">Back</a>');
  }

  try {
    await studentCollection.insertOne({ userName, branch, semester: parseInt(semester) });
    res.send('<h3>✅ Student added successfully.</h3><a href="/">Back</a>');
  } catch (err) {
    res.status(500).send('<h3>❌ Error saving student.</h3><a href="/">Back</a>');
  }
});

// GET - Show students from CSE and 6th semester
app.get('/filter', async (req, res) => {
  try {
    const result = await studentCollection.find({
      branch: 'CSE',
      semester: 6
    }).toArray();

    if (result.length === 0) {
      return res.send('<h3>📄 No CSE students in 6th Semester found.</h3><a href="/">Back</a>');
    }

    let html = '<h3>📄 CSE Students in 6th Semester:</h3><ul>';
    result.forEach(s => {
      html += `<li>${s.userName} - ${s.branch} - Semester ${s.semester}</li>`;
    });
    html += '</ul><a href="/">Back</a>';
    res.send(html);
  } catch (err) {
    res.status(500).send('<h3>❌ Error fetching data.</h3><a href="/">Back</a>');
  }
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
