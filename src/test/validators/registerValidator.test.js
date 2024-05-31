const registerValidator = require("../../validators/registerValidator");
const { expect } = require("chai");

describe("Register Validator", () => {
  it("should validate a correct registration", () => {
    const user = {
      email: "test@example.com",
      password: "password123",
    };
    const { error } = registerValidator.validate(user);
    expect(error).to.be.undefined;
  });

  it("should validate a correct registration with role as organizer", () => {
    const user = {
      email: "test@example.com",
      password: "password123",
      role: "organizer",
    };
    const { error } = registerValidator.validate(user);
    expect(error).to.be.undefined;
  });

  it("should validate a correct registration with role as attendee", () => {
    const user = {
      email: "test@example.com",
      password: "password123",
      role: "attendee",
    };
    const { error } = registerValidator.validate(user);
    expect(error).to.be.undefined;
  });

  it("should return error for empty email", () => {
    const user = {
      email: "",
      password: "password123",
    };
    const { error } = registerValidator.validate(user);
    expect(error).to.exist;
    if (error) {
      expect(error.details[0].message).to.equal(
        '"email" is not allowed to be empty'
      );
    }
  });

  it("should return error for incorrect email", () => {
    const user = {
      email: "test@@example.com",
      password: "password123",
    };
    const { error } = registerValidator.validate(user);
    expect(error).to.exist;
    if (error) {
      expect(error.details[0].message).to.equal(
        '"email" must be a valid email'
      );
    }
  });

  it("should return error for empty password", () => {
    const user = {
      email: "test@example.com",
      password: "",
    };
    const { error } = registerValidator.validate(user);
    expect(error).to.exist;
    if (error) {
      expect(error.details[0].message).to.equal(
        '"password" is not allowed to be empty'
      );
    }
  });

  it("should return error for invalid role", () => {
    const user = {
      email: "test@example.com",
      password: "password123",
      role: "incorrectRole",
    };
    const { error } = registerValidator.validate(user);
    expect(error).to.exist;
    if (error) {
      expect(error.details[0].message).to.equal(
        '"role" must be one of [attendee, organizer]'
      );
    }
  });
});
