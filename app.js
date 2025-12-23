// Core Module
const path = require('path');

// External Module
const express = require('express');
const app = express();

// Routers
const userRouter = require('./routes/userRouter');
const hostRouter = require('./routes/hostRouter');

app.use(express.urlencoded({ extended: true }));

// Mount routers
app.use("/user", userRouter);
app.use("/host", hostRouter);

// 404 Page
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'views', '404page.html'));
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`server is running on http://localhost:${PORT}`);
});