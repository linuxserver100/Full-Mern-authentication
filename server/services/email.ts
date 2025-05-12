// This service handles sending emails through SMTP2go
import nodemailer from 'nodemailer';

// Create transporter once
let transporter: nodemailer.Transporter | null = null;

// Initialize email transporter
function getTransporter() {
  if (!transporter) {
    // Check for required environment variables
    if (!process.env.SMTP_HOST || !process.env.SMTP_PORT || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.warn('Email service not configured properly. Check your environment variables.');
      // Return dummy transporter for development
      return {
        sendMail: async (options: any) => {
          console.log('Email would be sent with:', options);
          return { messageId: 'mock-id' };
        }
      };
    }

    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT, 10),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
  return transporter;
}

// Base function to send an email
async function sendEmail(to: string, subject: string, html: string) {
  const transport = getTransporter();
  
  const fromName = process.env.EMAIL_FROM_NAME || 'Authentication System';
  const fromEmail = process.env.EMAIL_FROM_ADDRESS || 'noreply@example.com';
  
  const mailOptions = {
    from: `"${fromName}" <${fromEmail}>`,
    to,
    subject,
    html,
  };

  try {
    const info = await transport.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

// Send verification email
export async function sendVerificationEmail(email: string, token: string) {
  const baseUrl = process.env.APP_URL || 'http://localhost:5000';
  const verificationUrl = `${baseUrl}/verify-email?token=${token}`;
  
  const subject = 'Verify Your Email Address';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Verify Your Email Address</h2>
      <p>Thank you for registering. Please verify your email address by clicking the button below:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${verificationUrl}" style="background-color: #3B82F6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Verify Email</a>
      </div>
      <p>Or copy and paste this link into your browser:</p>
      <p><a href="${verificationUrl}">${verificationUrl}</a></p>
      <p>This link will expire in 24 hours.</p>
      <p>If you didn't create an account, you can safely ignore this email.</p>
    </div>
  `;
  
  return sendEmail(email, subject, html);
}

// Send password reset email
export async function sendPasswordResetEmail(email: string, token: string) {
  const baseUrl = process.env.APP_URL || 'http://localhost:5000';
  const resetUrl = `${baseUrl}/reset-password?token=${token}`;
  
  const subject = 'Reset Your Password';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Reset Your Password</h2>
      <p>We received a request to reset your password. Click the button below to create a new password:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetUrl}" style="background-color: #3B82F6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
      </div>
      <p>Or copy and paste this link into your browser:</p>
      <p><a href="${resetUrl}">${resetUrl}</a></p>
      <p>This link will expire in 1 hour.</p>
      <p>If you didn't request a password reset, you can safely ignore this email.</p>
    </div>
  `;
  
  return sendEmail(email, subject, html);
}

// Send welcome email
export async function sendWelcomeEmail(email: string, name: string) {
  const baseUrl = process.env.APP_URL || 'http://localhost:5000';
  
  const subject = 'Welcome to Our Application!';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Welcome, ${name}!</h2>
      <p>Thank you for joining our platform. We're excited to have you on board!</p>
      <p>You can now log in and start using all the features of our application:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${baseUrl}/login" style="background-color: #3B82F6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Get Started</a>
      </div>
      <p>If you have any questions, feel free to reach out to our support team.</p>
    </div>
  `;
  
  return sendEmail(email, subject, html);
}

// Send login notification email
export async function sendLoginNotificationEmail(email: string, ipInfo: any) {
  const date = new Date().toLocaleString();
  const location = ipInfo.location || 'Unknown location';
  const ip = ipInfo.ip || 'Unknown IP';
  const device = ipInfo.userAgent || 'Unknown device';
  
  const subject = 'New Login to Your Account';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>New Login Detected</h2>
      <p>We detected a new login to your account with the following details:</p>
      <ul style="list-style: none; padding-left: 0;">
        <li><strong>Date & Time:</strong> ${date}</li>
        <li><strong>Location:</strong> ${location}</li>
        <li><strong>IP Address:</strong> ${ip}</li>
        <li><strong>Device:</strong> ${device}</li>
      </ul>
      <p>If this was you, you can ignore this email.</p>
      <p>If you didn't log in recently, please secure your account by changing your password immediately.</p>
    </div>
  `;
  
  return sendEmail(email, subject, html);
}

// Send email change confirmation
export async function sendEmailChangeConfirmation(oldEmail: string, newEmail: string) {
  const subject = 'Your Email Address Has Been Changed';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Email Address Change</h2>
      <p>Your email address has been changed from ${oldEmail} to ${newEmail}.</p>
      <p>If you didn't make this change, please contact our support team immediately.</p>
    </div>
  `;
  
  return sendEmail(oldEmail, subject, html);
}

// Send password change confirmation
export async function sendPasswordChangeConfirmation(email: string) {
  const subject = 'Your Password Has Been Changed';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Password Change</h2>
      <p>Your password has been successfully changed.</p>
      <p>If you didn't make this change, please contact our support team immediately.</p>
    </div>
  `;
  
  return sendEmail(email, subject, html);
}
