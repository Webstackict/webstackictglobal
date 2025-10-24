import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER, // your gmail
    pass: process.env.GMAIL_APP_PASS, // your app password
  },
});

// export const transporter = nodemailer.createTransport({
//   host: "smtp.ethereal.email",
//   port: 587,
//   auth: {
//     user: process.env.GMAIL_USER,
//     pass: process.env.GMAIL_APP_PASS,
//   },
// });

export async function sendEmail(
  firstName,
  lastName,
  email,
  tel,
  companyName,
  inquiryType,
  message
) {
  const mailOptions = {
    from: process.env.GMAIL_USER,
    replyTo: email,
    to: process.env.GMAIL_USER,
    subject: `New message from ${firstName}`,
    text: `Name: ${firstName} ${lastName}\nEmail: ${email}\nPhone: ${tel}\nCompany: ${
      companyName || "No company name provided"
    }\nInquiry: ${inquiryType}\nMessage: ${message}`,
  };
  const info = await transporter.sendMail(mailOptions);

  console.log("Message sent: %s", info?.messageId);

  // Only available when using Ethereal
  //   console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}
