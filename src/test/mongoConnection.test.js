const mongoose = require("mongoose");
require("dotenv").config();

before(async () => {
  try {
    if (process.env.TEST_MONGODB_URI) {
      await mongoose.connect(process.env.TEST_MONGODB_URI);
      const collections = await mongoose.connection.db.collections();
      for (let collection of collections) {
        await collection.drop();
      }
    }
  } catch (error) {
    console.error("Error connecting to the database", error);
  }
});

beforeEach(async () => {
  try {
  } catch (error) {
    console.error("Error during beforeEach", error);
  }
});

afterEach(async () => {
  try {
    const collections = await mongoose.connection.db.collections();
    for (let collection of collections) {
      await collection.drop();
    }
  } catch (error) {
    console.error("Error during afterEach", error);
  }
});

after(async () => {
  try {
    await mongoose.connection.close();
  } catch (error) {
    console.error("Error closing the connection", error);
  }
});
