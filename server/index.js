const express = require("express");
const ProductRoutes = require("./routes/product.route.js");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

const PORT = process.env.PORT;
const DB_PASSWORD = process.env.DB_PASSWORD;

mongoose
  .connect(
    `mongodb+srv://admin:${DB_PASSWORD}@crud-mern-db.0gw13jl.mongodb.net/crud-API?retryWrites=true&w=majority&appName=crud-mern-db`
  )
  .then(() => {
    console.log("Connected!");
    app.listen(PORT, () => console.log(`running on ${PORT}`));
  })
  .catch((err) => console.log(`Connection failed : ${err.message}`));

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Middleware to allow CORS
app.use((req, res, next) => {
  const allowedOrigins = [
    "http://localhost:3000",
    "https://aks-crud-mern.vercel.app","https://crud-task-iv4oxffae-mohamed-shariks-projects.vercel.app",
  ];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// routes
app.use("/products", ProductRoutes);
