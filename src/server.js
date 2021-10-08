// === Requirements config ====
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 4000;
const path = require("path");
// === End of Requirements config ====

// === App.use() Config
require("dotenv").config();
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());
// === End of App.use() Config

// Before any Routes, we send headers
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

// === Routes
app.use("/api", require("./routes/api"));
// === End of Routes

// if we reach here (after above 2 routes, means no routes were able to handle the request)
app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404; //404 error by definition is no fitting route
  next(error); //forward the error request
});

// serve index from build folder
if (process.env.NODE_ENV !== "local") {
  app.get("*", (req, res, next) => {
    res.setHeader("Cache-Control", "no-cache");
    res.sendFile(path.join(__dirname, "build/index.html"));
  });
}

app.listen({ port: PORT }, () => {
  console.log(`🚀  starting server -> ${process.env.NODE_ENV}`);
});

module.exports = app;
