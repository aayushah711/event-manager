const eventValidator = require("../../validators/eventValidator");
const { expect } = require("chai");

describe("Event Validator", () => {
  it("should validate a correct event", () => {
    const event = {
      title: "Test Event",
      date: "2024-05-30",
      time: "18:30",
      description: "Test Description",
    };
    const { error } = eventValidator.validate(event);
    expect(error).to.be.undefined;
  });

  it("should return error for an incorrect event", () => {
    const event = {
      title: "",
      date: "2024-05-30",
      time: "18:30",
      description: "Test Description",
    };
    const { error } = eventValidator.validate(event);
    expect(error).to.exist;
    if (error) {
      expect(error.details[0].message).to.equal(
        '"title" is not allowed to be empty'
      );
    }
  });
});
