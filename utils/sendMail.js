const nodemailer = require('nodemailer');
const fs = require('fs')
const path = require('path')
const templates = require("../emails/emailContent");
const sendEmail = async ({ to, subject, html, attachments }) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  await transporter.sendMail({
    from: process.env.MAIL_FROM,
    to,
    subject,
    html,
    attachments
  });
};



async function checkEmail(to,firstName, templateType,other) {
  let html = fs.readFileSync(
    path.join(__dirname, "../emails/baseTemplate.html"),
    "utf-8"
  );

  const template = templates[templateType];
  html = html
    .replace("{{firstName}}", firstName)
    .replace("{{title}}", template?.title)
    .replace("{{body}}", template?.body)
    .replace("{{clientUrl}}",process.env.BASE_URL)
    .replace("{{OTP}}",other);
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  await transporter.sendMail({
    from: `${process.env.MAIL_FROM}`,
    to,
    subject: template?.title,
    html
  });
}
async function inviteUser(to,senderName,reciverName,link) {
  let html = fs.readFileSync(
    path.join(__dirname, "../emails/inviteTemplate.html"),
    "utf-8"
  );

  const template = templates["inviteUser"];
  html = html
    .replace("{{firstName}}", reciverName)
    .replace("{{title}}", senderName)
    .replace("{{body}}", template.body)
    .replace("{{link}}",link);
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  await transporter.sendMail({
    from: `"Wizbizla" ${process.env.MAIL_FROM}`,
    to,
    subject:senderName+' '+  template.title,
    html
  });
}
module.exports = { sendEmail, checkEmail,inviteUser }