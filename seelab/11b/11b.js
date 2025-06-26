const express = require('express');
const { MongoClient } = require('mongodb');
const path = require('path');

const app = express();
const url = 'mongodb://127.0.0.1:27017';
const client = new MongoClient(url);
const dbName = 'attendanceDB';

app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname)); // To serve index.html

let studentsCollection;

// Connect to MongoDB
client.connect().then(() => {
  const db = client.db(dbName);
  studentsCollection = db.collection('students');
  console.log('✅ Connected to MongoDB');
}).catch(err => {
  console.error('❌ MongoDB connection failed:', err);
});

// Serve HTML form
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '11b.html'));
});

// POST - Submit student attendance data
app.post('/submit', async (req, res) => {
  const { student_id, name, course, total, attended } = req.body;
  const totalInt = parseInt(total);
  const attendedInt = parseInt(attended);

  if (!student_id || !name || !course || isNaN(totalInt) || isNaN(attendedInt) || totalInt === 0) {
    return res.send('<h3>❌ Invalid or missing input.</h3><a href="/">Back</a>');
  }

  const attendance_percentage = (attendedInt / totalInt) * 100;

  try {
    await studentsCollection.insertOne({
      student_id,
      name,
      course,
      total_attendance: totalInt,
      classes_attended: attendedInt,
      attendance_percentage
    });
    res.send('<h3>✅ Attendance submitted.</h3><a href="/">Back</a>');
  } catch {
    res.status(500).send('<h3>❌ Failed to store data.</h3><a href="/">Back</a>');
  }
});

// GET - Display students with attendance < 75%
app.get('/low-attendance', async (req, res) => {
  try {
    const low = await studentsCollection.find({
      attendance_percentage: { $lt: 75 }
    }).toArray();

    if (low.length === 0) {
      return res.send('<h3>🎉 No students with attendance below 75%.</h3><a href="/">Back</a>');
    }

    let html = '<h3>⚠️ Students with Attendance Below 75%:</h3><ul>';
    low.forEach(s => {
      html += `<li>${s.name} (ID: ${s.student_id}) - ${s.attendance_percentage.toFixed(2)}%</li>`;
    });
    html += '</ul><a href="/">Back</a>';
    res.send(html);
  } catch {
    res.status(500).send('<h3>❌ Error fetching data.</h3><a href="/">Back</a>');
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
