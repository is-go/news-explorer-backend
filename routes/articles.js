const express = require("express");
const {
  getSavedArticles,
  createArticle,
  deleteArticle,
} = require("../controllers/articles");
const auth = require("../middlewares/auth");

const router = express.Router();


router.get("/", auth, getSavedArticles);
router.post("/", auth, validateArticleBody, createArticle);
router.delete("/:articleId", auth, validateId, deleteArticle);

module.exports = router;
