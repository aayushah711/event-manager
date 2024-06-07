const loginValidator = require("../../validators/loginValidator");
const { expect } = require("chai");

describe("Login Validator", () => {
  it("should validate a correct login", () => {
    const user = { email: "test@example.com", password: "password123" };
    const { error } = loginValidator.validate(user);
    expect(error).to.be.undefined;
  });

  it("should return error for empty email", () => {
    const user = { email: "", password: "password123" };
    const { error } = loginValidator.validate(user);
    expect(error).to.exist;
    if (error) {
      expect(error.details[0].message).to.equal(
        '"email" is not allowed to be empty'
      );
    }
  });

  it("should return error for empty password", () => {
    const user = { email: "test@example.com", password: "" };
    const { error } = loginValidator.validate(user);
    expect(error).to.exist;
    if (error) {
      expect(error.details[0].message).to.equal(
        '"password" is not allowed to be empty'
      );
    }
  });
});
