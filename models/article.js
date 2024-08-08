const mongoose = require("mongoose");

// Define the article schema
const articleSchema = new mongoose.Schema({
  keyword: {
    type: String,
    required: true,
  },
  sourceName: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  publishedAt: {
    type: Date,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
    validate: {
      validator(value) {
        const urlRegex =
          /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
        return urlRegex.test(value);
      },
      message: "You must enter a valid URL",
    },
  },
});

// Create the article model
const Article = mongoose.model("Article", articleSchema);

module.exports = Article;
