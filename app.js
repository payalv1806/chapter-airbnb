// Core Module
const path = require('path');
const bodyParser = require('body-parser');

// External Module
const express = require('express');
const app = express();

app.set('view engine', 'ejs');
app.set('views','views');

// Middleware to parse URL-encoded bodies
app.use(bodyParser.urlencoded({extended: true}));


// Routers
const userRouter = require('./routes/userRouter');
const {hostRouter} = require('./routes/hostRouter');

app.get("/", (req, res) => {
  return res.redirect("/user");
});

// Mount routers
app.use("/user", userRouter);
app.use("/host", hostRouter);
app.use("/uploads",
express.static("/uploads"));
app.use(express.static(path.join(__dirname, '../public/stylehome.css')));


// 404 Page
app.use((req, res) => {
  res.status(404).render('404', {title: "Page Not Found"});
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`server is running on http://localhost:${PORT}`);
});