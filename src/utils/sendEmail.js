// @ts-nocheck
const sgMail = require("@sendgrid/mail");
require("dotenv").config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

function sendEmail(to, subject, text) {
  const msg = {
    to,
    from: process.env.USER_EMAIL,
    subject,
    text,
  };

  return sgMail.send(msg);
}

module.exports = sendEmail;
