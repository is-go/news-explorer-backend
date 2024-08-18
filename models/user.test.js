const mongoose = require("mongoose");
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
  it("should find a user by credentials", async () => {
    const email = "testuser@example.com";
    const password = "password123";

    const user = new User({
      user: "testuser",
      email,
      password,
    });

    await user.save();

    const foundUser = await User.findUserByCredentials(email, password);
    expect(foundUser).not.toBeNull();
  });
});
