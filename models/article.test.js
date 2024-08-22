const mongoose = require("mongoose");
const Article = require("./article");

const { ObjectId } = mongoose.Types;

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

describe("Article Model", () => {
  it("should create and save an article successfully", async () => {
    const article = new Article({
      keyword: "Tech",
      title: "Tech Trends",
      text: "Latest trends in technology.",
      date: new Date(),
      source: "Tech Source",
      link: "https://techsource.com/trends",
      image: "https://techsource.com/image.jpg",
      owner: new ObjectId(),
    });

    const savedArticle = await article.save();
    expect(savedArticle).toHaveProperty("_id");
    expect(savedArticle.title).toBe("Tech Trends");
  });

  it("should fail validation if required fields are missing", async () => {
    const article = new Article({
      keyword: "Tech",
    });

    let err;
    try {
      await article.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
  });
});
