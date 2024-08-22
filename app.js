require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

mongoose.set("strictQuery", true);
const cors = require("cors");
const { errors } = require("celebrate");
const limiter = require("./middlewares/limiter");
const config = require("./utils/config");

const mainRouter = require("./routes/index");
const errorHandler = require("./middlewares/error-handler");
const { requestLogger, errorLogger } = require("./middlewares/logger");

const app = express();

mongoose
  .connect(config.MONGODB_URI) // Use config value
  .then(() => {
    console.log("Connected to DB");
  })
  .catch(console.error);

// Limiter for security
app.use(limiter);

// Request logging middleware
app.use(requestLogger);

// Middleware for parsing json
app.use(express.json());

// CORS middleware
app.use(cors());

app.use("/", mainRouter);

// Error logging middleware
app.use(errorLogger);

// Celebrate error handling middleware
app.use(errors());

// Custom error handling middleware
app.use(errorHandler);

app.listen(config.PORT, () => {
  console.log(`App is listening on port ${config.PORT}`);
});

console.log("hello world!");
