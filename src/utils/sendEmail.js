// @ts-nocheck
const sgMail = require("@sendgrid/mail");
require("dotenv").config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmailWithRetry = async (to, subject, text, retries = 3) => {
  const msg = {
    to,
    from: process.env.USER_EMAIL,
    subject,
    text,
  };
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await sgMail.send(msg);
      return;
    } catch (error) {
      if (attempt === retries) {
        throw error;
      }
      console.warn(`Attempt ${attempt} failed, retrying...`);
    }
  }
};

module.exports = sendEmailWithRetry;
