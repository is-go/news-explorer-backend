const router = require("express").Router();
const NotFoundError = require("../errors/not-found-err");
const userRoutes = require("./users");
const articleRoutes = require("./articles");
const auth = require("../middlewares/auth");
const { createUser, userLogin } = require("../controllers/users");
const {
  validateUserBody,
  validateUserLogin,
} = require("../middlewares/validation");

// Public routes
router.post("/signup", validateUserBody, createUser);
router.post("/signin", validateUserLogin, userLogin);

// Protected routes
router.use("/users", auth, userRoutes);
router.use("/articles", auth, articleRoutes);

// for non-existent routes
router.use((req, res, next) => {
  next(new NotFoundError("Page not found."));
});

module.exports = router;
