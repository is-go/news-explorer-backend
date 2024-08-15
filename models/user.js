const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "The username field is required."],
    minlength: [2, "The username must be at least 2 character long."],
    maxlength: [30, "The username must be at most 30 characters long."],
  },
  email: {
    type: String,
    required: [true, "The email field is required."],
    unique: true,
    validate: {
      validator: function validateEmail(value) {
        return validator.isEmail(value);
      },
      message: "You must enter a valid email.",
    },
  },
  password: {
    type: String,
    required: [true, "The password field is required."],
    // minlength: [1, "The password must be at least 1 character long."],
    // maxlength: [30, "The password must be at most 30 characters long."], ADDED TO CONTROLLER
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function comparePassword(
  email,
  password,
) {
  return this.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error("Incorrect email or password"));
      }

      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(new Error("Incorrect email or password"));
        }

        return user;
      });
    });
};

userSchema.pre("save", async function hashBefore (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

module.exports = mongoose.model("User", userSchema);
