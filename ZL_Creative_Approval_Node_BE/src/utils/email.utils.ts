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

export const sendWorkspaceAddedEmail = async (
  email: string,
  workspaceName: string,
  accessDescription: string,
) => {
  const appLink = config.email.emailClientUrl;

  await transporter.sendMail({
    to: email,
    subject: `You've been added to ${workspaceName}`,
    text: `Hello,\n\nYou have been added to the workspace "${workspaceName}" with ${accessDescription} access.\n\nSign in here: ${appLink}\n\nBest,\nThe Support Team`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <p>Hello,</p>
        <p>You have been added to the workspace <strong>${workspaceName}</strong> with <strong>${accessDescription}</strong> access.</p>
        <p>
          <a href="${appLink}"
            style="background-color: #007bff; color: #ffffff; padding: 10px 15px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Open App
          </a>
        </p>
        <p>Best,<br>The Support Team</p>
      </div>
    `,
  });
};
