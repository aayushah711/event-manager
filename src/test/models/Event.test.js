const Event = require("../../models/Event");
const { expect } = require("chai");

describe("Event Model", () => {
  it("should create and save an event successfully", async () => {
    try {
      const validEvent = new Event({
        title: "Test Event",
        date: new Date(),
        time: new Date().toLocaleTimeString(),
        description: "Test description",
      });
      const savedEvent = await validEvent.save();
      expect(savedEvent._id).to.exist;
      expect(savedEvent.title).to.equal("Test Event");
      expect(savedEvent.date).to.exist;
      expect(savedEvent.time).to.exist;
      expect(savedEvent.description).to.equal("Test description");
      expect(savedEvent.participants).to.deep.equal([]);
    } catch (error) {
      console.error("Error saving event", error);
    }
  });

  it("should fail to create an event without required fields", async () => {
    const invalidEvent = new Event({});
    try {
      await invalidEvent.save();
    } catch (error) {
      expect(error).to.exist;
      expect(error.errors).to.have.property("title");
    }
  });
});
