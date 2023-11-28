import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
// import connectDB from "./configs/connectDB.js";
import connectDB_01 from "./configs/connectDB_01.js";
import accountRoutes from "./routes/accountRoutes.js";
import employeeRoutes from "./routes/employeeRoutes.js";
import tenantRoutes from "./routes/tenantRoutes.js";
import shiftRoutes from "./routes/ShiftandWSRoutes.js";
dotenv.config();
connectDB_01();

const app = express();

// Parse JSON data
app.use(express.json());

// Parse URL-encoded form data with extended option
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
  // res.setHeader("Access-Control-Allow-Origin", "http://localhost:58724");

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Api-Key, X-Requested-With, Content-Type, Accept, Authorization"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Pass to next layer of middleware
  next();
});

app.get("/", (req, res) => {
  res.send("API running");
});

//SUPER ADMIN
app.use("/api/account", accountRoutes);
app.use("/api/employee", employeeRoutes);
app.use("/api/tenant", tenantRoutes);

//Admin
app.use("/api/shift", shiftRoutes);
const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
