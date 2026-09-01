import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import crypto from 'crypto';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Rate limiters
const otpLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, 
  max: 5,
  message: 'Too many requests, please try again later.'
});

const verifyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: 'Too many verify attempts, please try again later.'
});

const transporter = nodemailer.createTransport({
  host: process.env.BREVO_SMTP_HOST || 'smtp-relay.brevo.com',
  port: parseInt(process.env.BREVO_SMTP_PORT || '587', 10),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.BREVO_SMTP_USER,
    pass: process.env.BREVO_SMTP_KEY,
  },
  tls: {
    rejectUnauthorized: true
  }
});

// In-memory store for OTPs
const otpStore = new Map();

app.post('/api/send-otp', otpLimiter, async (req, res) => {
  const { email } = req.body;
  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  try {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes

    otpStore.set(email, {
      otp: hashedOtp,
      expiresAt,
      attempts: 0
    });

    const mailOptions = {
      from: `"${process.env.BREVO_SENDER_NAME || 'Citizen Portal'}" <${process.env.BREVO_SENDER_EMAIL || process.env.BREVO_SMTP_USER}>`,
      to: email,
      subject: 'Citizen Portal Login OTP',
      text: `Your Citizen Portal verification code is: ${otp}\nThis OTP expires in 5 minutes.\nDo not share this code with anyone.`
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
});

app.post('/api/verify-otp', verifyLimiter, (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({ error: 'Email and OTP are required' });
  }

  const record = otpStore.get(email);
  if (!record) {
    return res.status(400).json({ error: 'No OTP requested or expired' });
  }

  if (Date.now() > record.expiresAt) {
    otpStore.delete(email);
    return res.status(400).json({ error: 'OTP has expired' });
  }

  record.attempts += 1;
  if (record.attempts > 3) {
    otpStore.delete(email);
    return res.status(400).json({ error: 'Too many failed attempts. Please request a new OTP.' });
  }

  const hashedInput = crypto.createHash('sha256').update(otp.toString()).digest('hex');
  if (hashedInput === record.otp) {
    otpStore.delete(email);
    return res.json({ message: 'OTP verified successfully' });
  } else {
    return res.status(400).json({ error: 'Invalid OTP' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
