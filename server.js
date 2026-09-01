import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

// Load Jharkhand emblem as base64 data URI (inline in email — never blocked by Gmail)
// Uses a 52×52 resized copy so the email stays well under Gmail's 102 KB clip limit.
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const emblemPath = path.join(__dirname, 'public', 'emblem_52.png');
const emblemDataUri = `data:image/png;base64,${fs.readFileSync(emblemPath).toString('base64')}`;

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
      from: {
        name: process.env.BREVO_SENDER_NAME || 'Societal Innovation Collaboration Portal',
        address: process.env.BREVO_SENDER_EMAIL || process.env.BREVO_SMTP_USER,
      },
      to: email,
      subject: 'Citizen Portal Login OTP',
      // Plain-text fallback for clients that do not render HTML
      text: `Your Citizen Portal OTP is: ${otp}\nThis code expires in 5 minutes. Do not share it with anyone.`,
      html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Citizen Portal Login OTP</title>
</head>

<body style="margin:0;padding:0;background:#f7f1e6;font-family:Arial,Helvetica,sans-serif;color:#24332b;">

<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f7f1e6;padding:30px 10px;">
<tr>
<td align="center">

<table width="680" cellpadding="0" cellspacing="0" border="0"
       style="max-width:680px;width:100%;background:#fffdf8;border-radius:18px;overflow:hidden;border:1px solid #eadcc5;">

  <!-- HEADER -->
  <tr>
    <td style="padding:24px 35px;background:#fffdf8;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <!-- Left: Emblem + Govt branding -->
          <td width="55%" valign="middle">
            <table cellpadding="0" cellspacing="0">
              <tr>
                <td valign="middle" style="padding-right:12px;">
                  <img src="${emblemDataUri}"
                       alt="Jharkhand Emblem" width="52" height="52"
                       style="display:block;border-radius:50%;border:2px solid #d9bd7a;" />
                </td>
                <td valign="middle">
                  <div style="font-size:19px;font-weight:bold;color:#173f2b;line-height:1.2;">
                    Government of Jharkhand
                  </div>
                  <div style="font-size:11px;color:#7b756c;margin-top:4px;">
                    Department of Higher &amp; Technical Education
                  </div>
                </td>
              </tr>
            </table>
          </td>

          <!-- Right: Portal branding -->
          <td width="45%" align="right" valign="middle">
            <div style="font-size:17px;font-weight:bold;color:#173f2b;line-height:1.3;">
              Societal Innovation<br>Collaboration Portal
            </div>
            <div style="font-size:11px;color:#a87516;margin-top:5px;letter-spacing:0.5px;">
              Collaborate. Innovate. Impact.
            </div>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- GOLD ACCENT BAR -->
  <tr>
    <td style="height:8px;background:linear-gradient(90deg,#c9a227,#e3c27e,#c9a227);"></td>
  </tr>

  <!-- MAIN CONTENT -->
  <tr>
    <td style="padding:40px 45px 35px;background:#fffdf8;">

      <!-- Lock icon + title -->
      <div style="text-align:center;">
        <div style="
          display:inline-block;
          width:62px;
          height:62px;
          line-height:62px;
          border-radius:50%;
          background:#edf4e9;
          border:2px solid #d9bd7a;
          font-size:28px;
          text-align:center;
        ">&#128272;</div>

        <h1 style="margin:20px 0 8px;font-size:28px;font-weight:bold;color:#173f2b;">
          Citizen Portal Login OTP
        </h1>

        <!-- Gold divider -->
        <div style="width:90px;height:2px;background:#d9bd7a;margin:14px auto 28px;"></div>
      </div>

      <!-- Greeting -->
      <p style="font-size:18px;font-weight:bold;color:#9b6810;margin:0 0 8px;">
        Hello,
      </p>

      <p style="font-size:15px;line-height:1.7;color:#555;margin:0 0 28px;">
        You are attempting to login to the
        <strong>Societal Innovation Collaboration Portal</strong>.
        Use the OTP below to verify your identity.
      </p>

      <!-- OTP BOX -->
      <table width="100%" cellpadding="0" cellspacing="0" border="0"
             style="background:#fbf5e9;border:1px dashed #d8b96f;border-radius:14px;">
        <tr>
          <td align="center" style="padding:28px 15px;">

            <div style="font-size:16px;font-weight:bold;color:#9b6810;margin-bottom:18px;letter-spacing:0.5px;">
              Your OTP Code
            </div>

            <!-- Individual digit boxes -->
            <table cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;">
              <tr>
                ${otp.split('').map(digit => `
                <td style="padding:0 5px;">
                  <div style="
                    width:46px;
                    height:58px;
                    line-height:58px;
                    font-size:34px;
                    font-weight:bold;
                    color:#173f2b;
                    background:#fffdf8;
                    border-radius:8px;
                    border:1px solid #d9bd7a;
                    text-align:center;
                    display:block;
                  ">${digit}</div>
                </td>`).join('')}
              </tr>
            </table>

          </td>
        </tr>
      </table>

      <!-- SECURITY INFO ROW -->
      <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:28px;">
        <tr>

          <td width="33%" align="center" style="border-right:1px solid #e5dccd;padding:10px 8px;">
            <div style="font-size:24px;">&#9200;</div>
            <div style="font-size:13px;color:#555;margin-top:5px;">Expires In</div>
            <strong style="font-size:14px;color:#9b6810;">05 Minutes</strong>
          </td>

          <td width="33%" align="center" style="border-right:1px solid #e5dccd;padding:10px 8px;">
            <div style="font-size:24px;">&#128737;</div>
            <div style="font-size:13px;color:#555;margin-top:5px;">For Your</div>
            <strong style="font-size:14px;color:#173f2b;">Security</strong>
          </td>

          <td width="33%" align="center" style="padding:10px 8px;">
            <div style="font-size:24px;">&#9993;</div>
            <div style="font-size:13px;color:#555;margin-top:5px;">Do Not Share</div>
            <strong style="font-size:14px;color:#173f2b;">This OTP</strong>
          </td>

        </tr>
      </table>

      <!-- SIGN-OFF -->
      <div style="margin-top:30px;padding-top:20px;border-top:1px solid #e6dccb;text-align:center;">
        <div style="font-size:14px;color:#666;">Thank you,</div>
        <div style="font-size:15px;font-weight:bold;color:#173f2b;margin-top:5px;">
          Societal Innovation Collaboration Portal Team
        </div>
        <div style="font-size:11px;color:#888;margin-top:14px;">
          This is an auto-generated email. Please do not reply to this email.
        </div>
      </div>

    </td>
  </tr>

  <!-- FOOTER -->
  <tr>
    <td style="background:#173f2b;padding:24px 30px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>

          <td width="33%" align="center" style="color:#fff;padding:6px 8px;">
            <strong style="font-size:14px;">Collaborate</strong>
            <div style="font-size:11px;margin-top:5px;color:#e7dfcf;">
              Together we solve<br>real problems
            </div>
          </td>

          <td width="33%" align="center"
              style="color:#fff;border-left:1px solid #55705e;border-right:1px solid #55705e;padding:6px 8px;">
            <strong style="font-size:14px;">Innovate</strong>
            <div style="font-size:11px;margin-top:5px;color:#e7dfcf;">
              Ideas into<br>impactful solutions
            </div>
          </td>

          <td width="33%" align="center" style="color:#fff;padding:6px 8px;">
            <strong style="font-size:14px;">Impact</strong>
            <div style="font-size:11px;margin-top:5px;color:#e7dfcf;">
              Building a better<br>Jharkhand
            </div>
          </td>

        </tr>
      </table>
    </td>
  </tr>

</table>

</td>
</tr>
</table>

</body>
</html>`
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
