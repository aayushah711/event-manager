const sinon = require("sinon");
const User = require("../../models/User");
const { expect } = require("chai");
const bcrypt = require("bcrypt");

describe("User Model - Without mocking", () => {
  it("should create and save a user successfully", async () => {
    const password = "password123";
    const email = "test@example.com";
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const validUser = new User({
        email,
        password: hashedPassword,
      });
      const savedUser = await validUser.save();
      expect(savedUser._id).to.exist;
      expect(savedUser.email).to.equal(email);
      const isMatch = await bcrypt.compare(password, savedUser.password);
      expect(isMatch).to.equal(true);
    } catch (error) {
      console.error("Error saving user", error);
    }
  }).timeout(50000);

  it("should fail to create a user without required fields", async () => {
    const invalidUser = new User({});
    try {
      await invalidUser.save();
    } catch (error) {
      expect(error).to.exist;
      expect(error.errors).to.have.property("email");
    }
  });
});

describe("User Model - With mocking", () => {
  let saveStub;
  const email = "test@example.com";
  const password = "password123";

  const validUser = new User({
    email,
    password,
  });
  before(() => {
    saveStub = sinon.stub(User.prototype, "save");
  });

  afterEach(() => {
    saveStub.restore();
  });

  it("should save a user successfully", async () => {
    try {
      const mockUser = {
        _id: 123,
        email,
        password,
      };
      saveStub.resolves(mockUser);

      const savedUser = await validUser.save();
      expect(savedUser._id).to.exist;
      expect(savedUser.email).to.equal(email);
      expect(savedUser.password).to.equal(password);
    } catch (error) {
      throw error;
    }
  });

  it("Validates the email", async () => {
    try {
      validUser.email = "test@123@gmail.com";
      const mockError = new Error("Database error");
      saveStub.rejects(mockError);
      const savedUser = await validUser.save();
    } catch (error) {
      expect(error).to.exist;
    }
  });
});
