import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (to, subject, text, htmlContent = '') => {
  try {
    const data = await resend.emails.send({
      from: process.env.EMAIL_USER, 
      to, 
      subject, 
      text, 
      html: htmlContent, 
    });
    
    console.log('✅ Email sent successfully:', data);
  } catch (error) {
    console.error('❌ Error sending email:', error);
  }
};





// // emailService.js
// import nodemailer from 'nodemailer';
// import dotenv from 'dotenv';

// dotenv.config(); // Load environment variables from .env file

// // Create a transporter using your email provider settings (e.g., Gmail)
// const transporter = nodemailer.createTransport({
//   service: 'gmail', // Example using Gmail
//   auth: {
//     user: process.env.EMAIL_USER, // The email address from which you are sending emails
//     pass: process.env.EMAIL_PASS, // The password or app password
//   },
// });

// // Function to send an email
// const sendEmail = async (to, subject, text, htmlContent = '') => {
//   const mailOptions = {
//     from: process.env.EMAIL_USER, // Sender address
//     to, // Recipient(s)
//     subject, // Subject line
//     text, // Plain text body
//     html: htmlContent, // Optional HTML content for the email body
//   };

//   try {
//     await transporter.sendMail(mailOptions);
//     console.log('Email sent successfully');
//   } catch (error) {
//     console.error('Error sending email:', error);
//   }
// };

// export { sendEmail };







// import FormData from "form-data";
// import Mailgun from "mailgun.js";
// import dotenv from "dotenv";
// dotenv.config();

// const mailgun = new Mailgun(FormData);
// const mg = mailgun.client({
//   username: "api",
//   key: process.env.MAILGUN_API_KEY,
// });

// export const sendEmail = async (to, subject, text, html) => {
//   try {
//     const message = await mg.messages.create(process.env.MAILGUN_DOMAIN, {
//       from: `${process.env.MAILGUN_FROM_NAME} <${process.env.MAILGUN_FROM_EMAIL}>`,
//       to,
//       subject,
//       text,
//       html,
//     });
//     console.log("Email sent:", message.id);
//   } catch (err) {
//     console.error("Email send failed:", err);
//   }
// };
