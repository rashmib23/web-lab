const express = require('express');
const { MongoClient } = require('mongodb');
const path = require('path');

const app = express();
const url = 'mongodb://127.0.0.1:27017';
const client = new MongoClient(url);
const dbName = 'examDB';

app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname)); // to serve index.html

let studentCollection;

// Connect to MongoDB
client.connect().then(() => {
  const db = client.db(dbName);
  studentCollection = db.collection('students');
  console.log('✅ Connected to MongoDB');
}).catch(err => {
  console.error('❌ MongoDB connection error:', err);
});

// Serve HTML form
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '12b.html'));
});

// POST - Submit student data
app.post('/submit', async (req, res) => {
  const { student_id, name, subject, marks } = req.body;
  const marksInt = parseInt(marks);

  if (!student_id || !name || !subject || isNaN(marksInt)) {
    return res.send('<h3>❌ Invalid input. All fields are required.</h3><a href="/">Back</a>');
  }

  const status = marksInt < 20 ? "Not Eligible" : "Eligible";

  try {
    await studentCollection.insertOne({
      student_id,
      name,
      subject,
      marks: marksInt,
      eligibility_status: status
    });
    res.send(`<h3>✅ Student submitted. Status: ${status}</h3><a href="/">Back</a>`);
  } catch {
    res.status(500).send('<h3>❌ Submission failed.</h3><a href="/">Back</a>');
  }
});

// GET - List of Not Eligible students
app.get('/not-eligible', async (req, res) => {
  try {
    const list = await studentCollection.find({ eligibility_status: "Not Eligible" }).toArray();
    if (list.length === 0) {
      return res.send('<h3>🎉 No students are marked Not Eligible.</h3><a href="/">Back</a>');
    }

    let html = '<h3>❌ Not Eligible Students:</h3><ul>';
    list.forEach(s => {
      html += `<li>${s.name} (${s.student_id}) - ${s.subject} - ${s.marks} Marks</li>`;
    });
    html += '</ul><a href="/">Back</a>';
    res.send(html);
  } catch {
    res.status(500).send('<h3>❌ Error fetching data.</h3><a href="/">Back</a>');
  }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
