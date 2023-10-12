import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import connectDB from "./configs/connectDB.js";
import connectDB_01 from "./configs/connectDB_01.js";
import accountRoutes from "./routes/accountRoutes.js";
dotenv.config();
connectDB_01();

const app = express();

// Parse JSON data
app.use(express.json());

// Parse URL-encoded form data with extended option
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("API running");
});

app.use("/api/account", accountRoutes);

const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
