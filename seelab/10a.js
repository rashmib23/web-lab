const express = require('express');
const app = express();

let visitCount = 0;

// Logger middleware
const logger = (req, res, next) => {
    console.log(`Request made to: ${req.url}`);
    next();
};

// Visitor count middleware
const countVisitor = (req, res, next) => {
    visitCount++;
    console.log(`Visitor count: ${visitCount}`);
    next();
};

app.use(logger);
app.use(countVisitor);

app.get('/', (req, res) => res.send("Welcome to the site!"));

app.listen(3000, () => console.log("Server started on port 3000"));
