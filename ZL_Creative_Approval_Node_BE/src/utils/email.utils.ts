import nodemailer from "nodemailer";
import { config } from "../config";

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: config.email.emailUser,
    pass: config.email.emailPassword,
  },
});

export const sendResetEmail = async (email: string, token: string) => {
  const resetLink = `${config.email.emailClientUrl}/reset-password/${token}`;

  await transporter.sendMail({
    to: email,
    subject: "Password Reset Request",
    // text: `Click here to reset password: ${resetLink}`,
    text: `Hello, \n\nYou requested a password reset. Click the link below to reset your password:\n\n${resetLink}\n\nIf you did not request this, you can safely ignore this email.\n\nBest,\nThe Support Team`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <p>Hello,</p>
        <p>You requested a password reset. Click the button below to reset your password:</p>
        <p>
          <a href="${resetLink}" 
            style="background-color: #007bff; color: #ffffff; padding: 10px 15px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Reset Password
          </a>
        </p>
        <p>If you did not request this, you can safely ignore this email.</p>
        <p>Best,<br>The Support Team</p>
      </div>
    `,
  });
};
