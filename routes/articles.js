const express = require("express");
const {
  getSavedArticles,
  createArticle,
  deleteArticle,
  toggleSaveArticle,
  deleteSavedArticle,
} = require("../controllers/articles");
const auth = require("../middlewares/auth");
const {
  validateArticleBody,
  validateId,
} = require("../middlewares/validation");

const router = express.Router();

router.get("/", auth, getSavedArticles);
router.post("/", auth, validateArticleBody, createArticle);
router.delete("/:articleId", auth, validateId, deleteArticle);
router.patch("/:articleId/save", auth, validateId, toggleSaveArticle);
router.delete("/:articleId/save", auth, validateId, deleteSavedArticle);

module.exports = router;
