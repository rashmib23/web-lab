// app.js
const express = require('express');
const { MongoClient } = require('mongodb');
const path = require('path');

const app = express();
const url = 'mongodb://127.0.0.1:27017';
const client = new MongoClient(url);
const dbName = 'HR';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

let employeesCollection;

client.connect().then(() => {
  const db = client.db(dbName);
  employeesCollection = db.collection('employees');
  console.log('✅ Connected to MongoDB (HR database)');
}).catch(err => {
  console.error('❌ MongoDB connection error:', err);
});

// Serve HTML form
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '3b.html'));
});

// POST - Add employee
app.post('/submit', async (req, res) => {
  const { emp_name, email, phone, hire_date, job_title, salary } = req.body;

  const employee = {
    emp_name,
    email,
    phone,
    hire_date,
    job_title,
    salary: parseFloat(salary)
  };

  try {
    await employeesCollection.insertOne(employee);
    res.send(`<h3>Employee record submitted successfully.</h3><a href="/">Back</a>`);
  } catch (err) {
    res.status(500).send('Error inserting employee record.');
  }
});

// GET - Employees with salary > 50000
app.get('/high-salary', async (req, res) => {
  try {
    const result = await employeesCollection.find({ salary: { $gt: 50000 } }).toArray();
    res.send(`<pre>${JSON.stringify(result, null, 2)}</pre><a href="/">Back</a>`);
  } catch (err) {
    res.status(500).send('Error fetching high salary employees.');
  }
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
