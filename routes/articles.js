const express = require("express");
const {
  getSavedArticles,
  createArticle,
  deleteArticle,
} = require("../controllers/articles");
const auth = require("../middlewares/auth");

const router = express.Router();

// Get all articles saved by the user
router.get("/", auth, getSavedArticles);

// Create an article
router.post("/", auth, createArticle);

// Delete an article by _id
router.delete("/:articleId", auth, deleteArticle);

module.exports = router;
