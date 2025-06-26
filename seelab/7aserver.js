const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/cse', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'cse.html'));
});

app.get('/ece', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'ece.html'));
});

app.get('/mech', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'mech.html'));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
