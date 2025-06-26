// app.js
const express = require('express');
const { MongoClient } = require('mongodb');
const path = require('path');

const app = express();
const url = 'mongodb://127.0.0.1:27017';
const client = new MongoClient(url);
const dbName = 'collegeDB';

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // For form data
app.use(express.static(__dirname)); // Serve HTML and static files

let studentCollection;

client.connect().then(() => {
  const db = client.db(dbName);
  studentCollection = db.collection('students');
  console.log('✅ Connected to MongoDB');
}).catch(err => {
  console.error('❌ MongoDB Connection Error:', err);
});

// Serve HTML form
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '2b.html'));
});

// POST - Add student
app.post('/submit', async (req, res) => {
  const { name, usn, semester, exam_fee } = req.body;

  const student = {
    name,
    usn,
    semester,
    exam_fee: exam_fee ? parseFloat(exam_fee) : 0
  };

  try {
    await studentCollection.insertOne(student);
    res.send(`<h3>Student data submitted successfully.</h3><a href="/">Back</a>`);
  } catch (err) {
    res.status(500).send('Error inserting student data.');
  }
});

// DELETE - Remove unpaid students
app.post('/delete-unpaid', async (req, res) => {
  try {
    const result = await studentCollection.deleteMany({
      $or: [
        { exam_fee: { $eq: 0 } },
        { exam_fee: { $exists: false } },
        { exam_fee: null }
      ]
    });
    res.send(`<h3>Deleted ${result.deletedCount} unpaid students.</h3><a href="/">Back</a>`);
  } catch (err) {
    res.status(500).send('Error deleting unpaid students.');
  }
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
