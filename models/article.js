const mongoose = require("mongoose");
const { validateURL } = require("../utils/validator");

const articleSchema = new mongoose.Schema({
  keyword: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  source: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator: validateURL,
      message: "The link field must be a valid URL",
    },
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator: validateURL,
      message: "The image field must be a valid URL",
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    select: false,
  },
  isSaved: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Article", articleSchema);
