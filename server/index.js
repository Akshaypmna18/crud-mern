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

// routes
app.use("/products", ProductRoutes);
