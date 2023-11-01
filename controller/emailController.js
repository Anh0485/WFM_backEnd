import dotenv from "dotenv";

import nodemailer from "nodemailer";
import { google } from "googleapis";

const OAuth2 = google.auth.OAuth2;

const createTransporter = async () => {
  const oauth2Client = new OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    "https://developers.google.com/oauthplayground"
  );

  oauth2Client.setCredentials({
    refresh_token: process.env.REFRESH_TOKEN,
  });

  const accessToken = await new Promise((resolve, reject) => {
    oauth2Client.getAccessToken((err, token) => {
      if (err) {
        console.log(err);
        reject("Failed to create access token :(");
      }
      resolve(token);
    });
  });

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.EMAIL,
      accessToken,
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      refreshToken: process.env.REFRESH_TOKEN,
    },
  });

  return transporter;
};

const sendEmail = async (emailOptions) => {
  let emailTransporter = await createTransporter();
  await emailTransporter.sendMail(emailOptions);
};

const sendPasswordResetEmail = async (email, resetToken, origin) => {
  let message;

  if (origin) {
    const resetUrl = `${origin}/api/account/resetPassword?token=${resetToken} email=${email}`;
    message = `<p>Please click the below link to reset your password, the following link will be valid for only 1 hour:</p>
                     <p><a href="${resetUrl}">${resetUrl}</a></p>`;
  } else {
    message = `<p>Please use the below token to reset your password with the 
    <code>http://localhost:4200/#/verify-page</code> 
     api route :</p>
    <p><code>${resetToken}</code></p>`;
  }

  await sendEmail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: " Reset your Password",
    html: `<h4>Reset Password</h4>
    ${message}`,
  });
};

export { sendPasswordResetEmail };
