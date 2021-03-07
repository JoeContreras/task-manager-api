const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: "joe.contreras809@gmail.com",
    subject: "Thank you for joining us.",
    text: `Welcome to the app, ${name}, Let us know what you think about it.`,
  });
};

const sendCancellationEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: "joe.contreras809@gmail.com",
    subject: "Account Cancellation",
    text: `We're sorry to see you go ${name}, Let us know why you decided to cancel your account if you have the time.`,
  });
};

module.exports = { sendWelcomeEmail, sendCancellationEmail };
