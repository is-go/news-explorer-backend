const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./user");

// Connect to the database before all tests
beforeAll(async () => {
  await mongoose.connect("mongodb://127.0.0.1:27017/testdb", {
  });
});

// Drop the database before each test
beforeEach(async () => {
  await mongoose.connection.db.dropDatabase();
});

// Close the connection after all tests are done
afterAll(async () => {
  await mongoose.connection.close();
});

describe("User Model", () => {
  it("should hash the password before saving", async () => {
    const user = new User({
      username: "testuser",
      email: "testuser@example.com",
      password: "password123",
    });

    await user.save();
    expect(user.password).not.toBe("password123");
    const isMatch = await bcrypt.compare("password123", user.password);
    expect(isMatch).toBe(true);
  });

  it("should find a user by credentials", async () => {
    const email = "testuser@example.com";
    const password = "password123";

    const user = new User({
      username: "testuser",
      email,
      password,
    });

    await user.save();

    const foundUser = await User.findUserByCredentials(email, password);
    expect(foundUser).not.toBeNull();
  });
});
