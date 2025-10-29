const nodemailer = require('nodemailer')

exports.emailSender = async (options) => {

  // Create a test account or replace with real credentials.
  const transporter = nodemailer.createTransport({
    service: process.env.SERVICE,
    host: process.env.EMAIL_HOST,
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.APP_USER,
      pass: process.env.APP_PASSWORD,
    },
  });

  // Wrap in an async IIFE so we can use await.
  (async () => {
    try {
      const info = await transporter.sendMail({
        from: `${process.env.APP_USER}`,
        to: options.email,
        subject: options.subject,
        html: options.html,
        // text: 'This is an automated message. Please do not reply to this email',
        // replyTo: 'no-reply@nowhere.com'
      });

      console.log("Message has been sent to:", options.email);
    } catch (error) {
      console.log(error.message)
    }
  })();
}