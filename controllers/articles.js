const Article = require("../models/article");
const NotFoundError = require("../errors/not-found-err");
const BadRequestError = require("../errors/bad-request-err");
const ForbiddenError = require("../errors/forbidden-err");

// Get all articles saved by the user
const getSavedArticles = (req, res, next) => {
  Article.find({ owner: req.user._id })
    .then((articles) => res.status(200).send(articles))
    .catch(next);
};

// Create an article
const createArticle = (req, res, next) => {
  const { keyword, title, text, date, source, link, image } = req.body;
  const owner = req.user._id;

  Article.create({ keyword, title, text, date, source, link, image, owner })
    .then((article) => res.status(201).send(article))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(new BadRequestError("Invalid data"));
      }
      return next(err);
    });
};

const deleteArticle = (req, res, next) => {
  const { articleId } = req.params;

  Article.findById(articleId)
    .select("+owner") // Ensure owner is selected
    .orFail(() => new NotFoundError("Article not found"))
    .then((article) => {
      if (!article.owner.equals(req.user._id)) {
        throw new ForbiddenError(
          "You do not have permission to delete this article",
        );
      }
      return Article.deleteOne({ _id: articleId }) // Use deleteOne instead of remove
        .then(() => res.status(200).send({ message: "Article deleted" }));
    })
    .catch(next);
};

const toggleSaveArticle = (req, res, next) => {
  const { articleId } = req.params;

  Article.findById(articleId)
    .select("+owner") // Ensure owner is selected
    .orFail(() => new NotFoundError("Article not found"))
    .then((article) => {
      if (!article.owner.equals(req.user._id)) {
        throw new ForbiddenError(
          "You do not have permission to save or unsave this article",
        );
      }
      // Create a copy of the article object and toggle the isSaved status
      const updatedArticle = article.toObject();
      updatedArticle.isSaved = !article.isSaved;

      return Article.findByIdAndUpdate(article._id, updatedArticle, {
        new: true,
      });
    })
    .then((updatedArticle) =>
      res.status(200).send({
        message: `Article ${updatedArticle.isSaved ? "saved" : "unsaved"}`,
        article: updatedArticle,
      }),
    )
    .catch(next);
};

const deleteSavedArticle = (req, res, next) => {
  const { articleId } = req.params;

  Article.findById(articleId)
    .select("+owner") // Ensure owner is selected
    .orFail(() => new NotFoundError("Article not found"))
    .then((article) => {
      if (!article.owner.equals(req.user._id)) {
        throw new ForbiddenError(
          "You do not have permission to delete this article",
        );
      }
      // Create a copy of the article object and set isSaved to false
      const updatedArticle = article.toObject();
      updatedArticle.isSaved = false;

      return Article.findByIdAndUpdate(article._id, updatedArticle, {
        new: true,
      });
    })
    .then(() => res.status(200).send({ message: "Article unsaved" }))
    .catch(next);
};

module.exports = {
  getSavedArticles,
  createArticle,
  deleteArticle,
  toggleSaveArticle,
  deleteSavedArticle,
};
