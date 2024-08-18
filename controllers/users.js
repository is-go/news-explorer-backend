const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");

const BadRequestError = require("../errors/bad-request-err");
const ConflictError = require("../errors/conflict-err");
const NotFoundError = require("../errors/not-found-err");
const UnauthorizedError = require("../errors/unauthorized-err");

const createUser = (req, res, next) => {
  const { user, email, password } = req.body;

  if (!email || !password || !user) {
    return next(new BadRequestError("Invalid data"));
  }

  // Validate password length before hashing
  if (password.length < 6 || password.length > 30) {
    return next(
      new BadRequestError("Password must be between 8 and 30 characters long."),
    );
  }

  return User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new ConflictError(
          "An email address that already exists on the server",
        );
      }

      return bcrypt.hash(password, 10).then((hash) =>
        User.create({ user, email, password: hash }).then((newUser) => {
          const payload = newUser.toObject();
          delete payload.password; // Remove the password from the response
          return res.status(201).send({ data: payload });
        }),
      );
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return next(new BadRequestError("Invalid data"));
      }
      if (err.code === 11000) {
        return next(
          new ConflictError(
            "An email address that already exists on the server",
          ),
        );
      }
      return next(err);
    });
};

const userLogin = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new BadRequestError("Invalid data"));
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      return res.send({ token });
    })
    .catch((err) => {
      console.error(err);
      if (err.message === "Incorrect email or password") {
        return next(new UnauthorizedError("An incorrect email or password"));
      }
      if (err.name === "DocumentNotFoundError") {
        return next(new BadRequestError("Invalid data"));
      }
      return next(err);
    });
};

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => {
      throw new NotFoundError("There is no user with the requested id");
    })
    .then((user) => res.status(200).send({ user }))
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid ID"));
      }
      return next(err);
    });
};

module.exports = {
  createUser,
  userLogin,
  getCurrentUser,
};
