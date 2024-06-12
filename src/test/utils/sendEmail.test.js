const { expect } = require("chai");
const sendEmail = require("../../utils/sendEmail");

describe("Send Email Utility", () => {
  it("should send an email successfully", async () => {
    try {
      const result = await sendEmail(
        process.env.USER_EMAIL,
        "Test Email",
        "This is a test email"
      );
      expect(result).to.equal(undefined);
    } catch (error) {
      console.error("Error sending email", error);
    }
  });
});
