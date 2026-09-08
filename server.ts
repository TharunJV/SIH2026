import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const PORT = 3000;

// --- DIAGNOSTICS & CONFIGURATION ---
const isGmailConfigured = Boolean(
  process.env.GMAIL_USER ||
  (process.env.SMTP_USER && process.env.SMTP_USER.includes('@gmail.com')) ||
  process.env.SMTP_HOST === 'smtp.gmail.com'
);

const hasSmtp = Boolean(
  (process.env.BREVO_SMTP_USER && process.env.BREVO_SMTP_KEY) ||
  (process.env.SMTP_USER && process.env.SMTP_PASS) ||
  (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD)
);

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || 'https://gtoyomeqnxcnfxaeydaw.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY;

console.log('====================================================');
console.log('   JH INNOVATION CONNECT - FULL-STACK APP SERVER');
console.log('====================================================');
console.log('• Server Port:      ', PORT, '(0.0.0.0)');
console.log('• Supabase URL:     ', supabaseUrl ? '✓ Configured' : '✗ Missing');
console.log('• Supabase Key:     ', supabaseKey ? '✓ Configured' : '✗ Missing');
console.log('• Gemini API Key:   ', process.env.GEMINI_API_KEY ? '✓ Configured' : '⚠️ Missing (Fallback Active)');
if (hasSmtp) {
  const provider = isGmailConfigured ? 'Gmail SMTP' : (process.env.BREVO_SMTP_USER ? 'Brevo SMTP' : 'Custom SMTP');
  console.log(`• Mail Transporter:  ✓ Configured (${provider})`);
} else {
  console.log('• Mail Transporter:  ⚠️ Not configured (Demo/Auto-fill mode active)');
}
console.log('====================================================');

// Initialize Supabase client
let supabase: any = null;
if (supabaseUrl && supabaseKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey);
  } catch (err: any) {
    console.warn('⚠️ Supabase client init warning:', err?.message || err);
  }
}

// Lazy Gemini client
let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  if (!geminiClient) {
    try {
      geminiClient = new GoogleGenAI({ apiKey });
    } catch (e: any) {
      console.warn('⚠️ GoogleGenAI client init error:', e?.message || e);
      return null;
    }
  }
  return geminiClient;
}

const SYSTEM_PROMPT = `You are SolveSphere AI, the virtual assistant for JH Innovation Connect (Jharkhand's societal problem-solving and innovation platform).

CORE INSTRUCTIONS:
1. BE CRISP & CONCISE: Give only the necessary, direct answer to the user's question. Do NOT dump long unsolicited essays, feature dumps, or lengthy overviews. Keep answers to 1-3 short paragraphs or 2-4 brief bullet points.
2. SIMPLE GREETINGS: If the user says "hi", "hello", "hey", "namaste", or similar greetings, reply with a simple, polite 1-2 sentence greeting (e.g., "Hello! Welcome to JH Innovation Connect. How can I help you today?"). NEVER dump platform features or lists for a greeting.
3. RELEVANT ANSWERS ONLY: Answer strictly what was asked. If the user asks how to report, explain reporting briefly. If they ask about tracking, explain tracking.
4. ROUTING & NAVIGATION COMMANDS: If the user asks to navigate or open a page (e.g. "open report", "report a problem", "go to dashboard", "view challenges", "login", "track problem"):
   - Acknowledge their request directly.
   - Include a navigation tag in your response:
     - [NAVIGATE:submit-challenge] for reporting a problem / submitting a challenge
     - [NAVIGATE:citizen-my-challenges] for tracking complaints or viewing my reported challenges
     - [NAVIGATE:dashboard] for opening the user dashboard
     - [NAVIGATE:explore-challenges] for exploring public challenges
     - [NAVIGATE:industry-open-challenges] for open problem statements
     - [NAVIGATE:login] for login
     - [NAVIGATE:signup] for registration
5. LANGUAGE: Respond naturally in the user's language (English, Hindi, etc.) politely and concisely.`;

function getFallbackResponse(rawMessage: string): string {
  const msg = rawMessage.toLowerCase().trim();

  // Greetings
  if (/^(hi|hello|hey|namaste|pranam|greetings|hola)\b/i.test(msg) || msg === 'hi' || msg === 'hello') {
    return 'Namaste! Welcome to JH Innovation Connect. I am SolveSphere AI, your virtual assistant. How can I assist you today? You can ask questions or ask to open forms, track issues, or explore challenges.';
  }

  // Reporting problems
  if (msg.includes('report') || msg.includes('submit') || msg.includes('complaint') || msg.includes('issue') || msg.includes('file')) {
    return 'You can submit a localized societal challenge or infrastructure problem affecting your village, block, or district. Our platform will analyze the issue and link it with university research teams. [NAVIGATE:submit-challenge]';
  }

  // Tracking
  if (msg.includes('track') || msg.includes('my challenge') || msg.includes('status') || msg.includes('history') || msg.includes('complaints')) {
    return 'You can view and track all your submitted challenges, verification milestones, and university intervention updates. [NAVIGATE:citizen-my-challenges]';
  }

  // Dashboard
  if (msg.includes('dashboard') || msg.includes('overview') || msg.includes('portal')) {
    return 'Opening your personalized portal dashboard with real-time statistics and recent activities. [NAVIGATE:dashboard]';
  }

  // Explore
  if (msg.includes('explore') || msg.includes('browse') || msg.includes('all challenge') || msg.includes('search')) {
    return 'Browse verified crowdsourced community challenges across all 24 districts of Jharkhand with geospatial heatmaps. [NAVIGATE:explore-challenges]';
  }

  // Open problem statements / Industry
  if (msg.includes('industry') || msg.includes('msme') || msg.includes('csr') || msg.includes('open problem') || msg.includes('funding')) {
    return 'Explore verified problem statements open for corporate social responsibility (CSR) funding, industry co-development, and pilot testing. [NAVIGATE:industry-open-challenges]';
  }

  // Login / Auth
  if (msg.includes('login') || msg.includes('sign in')) {
    return 'Directing you to the portal login screen. [NAVIGATE:login]';
  }
  if (msg.includes('signup') || msg.includes('register') || msg.includes('create account')) {
    return 'Directing you to citizen registration. [NAVIGATE:signup]';
  }

  // Universities
  if (msg.includes('university') || msg.includes('college') || msg.includes('research') || msg.includes('bit mesra') || msg.includes('iit')) {
    return 'JH Innovation Connect partners with premier academic institutions like BIT Mesra, IIT (ISM) Dhanbad, and NIT Jamshedpur to develop multidisciplinary, field-deployable solutions for grassroots problems.';
  }

  // Government / Policy
  if (msg.includes('government') || msg.includes('pmu') || msg.includes('jharkhand') || msg.includes('scheme')) {
    return 'The Government of Jharkhand (Department of Higher and Technical Education & State PMU) provides validation, departmental sanctioning, and resource allocation across all 24 districts.';
  }

  return `JH Innovation Connect bridges citizens, academic researchers, industries, and government to solve societal challenges across Jharkhand.\n\n` +
    `• To submit an issue, type "open report" or click [NAVIGATE:submit-challenge]\n` +
    `• To check past reports, type "track complaints" or click [NAVIGATE:citizen-my-challenges]\n` +
    `• To browse public issues, type "explore challenges" or click [NAVIGATE:explore-challenges]`;
}

// In-memory OTP store
const otpStore = new Map<string, any>();

// Setup Nodemailer transporter if credentials exist
let transporter: any = null;
let smtpFromAddress = 'no-reply@jharkhand.gov.in';

if (hasSmtp) {
  try {
    const smtpHost = process.env.SMTP_HOST || process.env.BREVO_SMTP_HOST || (isGmailConfigured ? 'smtp.gmail.com' : 'smtp-relay.brevo.com');
    const smtpPort = parseInt(process.env.SMTP_PORT || process.env.BREVO_SMTP_PORT || (isGmailConfigured ? '465' : '587'), 10);
    const smtpUser = process.env.SMTP_USER || process.env.GMAIL_USER || process.env.BREVO_SMTP_USER;
    const smtpPass = process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD || process.env.BREVO_SMTP_KEY;
    const smtpSecure = smtpPort === 465 || process.env.SMTP_SECURE === 'true';

    smtpFromAddress = process.env.BREVO_SENDER_EMAIL || process.env.SMTP_FROM || smtpUser || 'no-reply@jharkhand.gov.in';

    transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    transporter.verify().then(() => {
      console.log(`✓ SMTP Connection Verified successfully with ${smtpHost}:${smtpPort} (Account: ${smtpUser})`);
    }).catch((err: any) => {
      console.error(`✗ SMTP Connection Check Failed (${smtpHost}:${smtpPort}):`, err?.message || err);
      console.warn('  (Server will use reliable simulated OTP fallback if sending fails)');
    });
  } catch (e: any) {
    console.warn('⚠️ SMTP Transporter init failed:', e?.message || e);
  }
}

async function startAppServer() {
  const app = express();

  // Enable JSON body parsing & open CORS
  app.use(express.json());
  app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));

  // Rate limiters
  const otpLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 60,
    message: { error: 'Too many OTP requests. Please wait a minute before trying again.' },
  });

  const verifyLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { error: 'Too many verify attempts. Please wait before trying again.' },
  });

  // -----------------------------------------------------------------------------
  // API ROUTES
  // -----------------------------------------------------------------------------

  // 1. Health check endpoint
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      service: 'JH Innovation Connect Backend API',
      uptimeSeconds: Math.floor(process.uptime()),
      smtpConfigured: hasSmtp,
      supabaseConfigured: Boolean(supabase),
      geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
      timestamp: new Date().toISOString(),
    });
  });

  // 2. AI health check endpoint (compatible with ai-server)
  app.get(['/api/ai-health', '/health'], (_req, res) => {
    res.json({
      status: 'ok',
      service: 'SolveSphere AI',
      primary: 'Gemini 2.5 Flash',
      fallback: 'SolveSphere Core Rules Engine',
      gemini_ready: Boolean(process.env.GEMINI_API_KEY),
      groq_ready: Boolean(process.env.GROQ_API_KEY),
    });
  });

  // 3. AI Chat endpoint (replaces Python FastAPI ai-server)
  app.post(['/api/chat', '/chat'], async (req, res) => {
    const message = (req.body?.message || '').trim();
    if (!message) {
      return res.status(400).json({ error: 'Message cannot be empty.' });
    }

    // Try Gemini API first if configured
    const ai = getGeminiClient();
    if (ai) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: `${SYSTEM_PROMPT}\n\nCitizen message:\n${message}`,
        });
        const text = response.text?.trim();
        if (text) {
          return res.json({ response: text, provider: 'gemini' });
        }
      } catch (err: any) {
        console.warn('⚠️ Gemini request failed, using intelligent fallback:', err?.message || err);
      }
    }

    // Fallback rule engine (instant, reliable, zero external dependencies)
    const fallbackResponse = getFallbackResponse(message);
    return res.json({
      response: fallbackResponse,
      provider: ai ? 'solvesphere-rules-fallback' : 'solvesphere-core',
    });
  });

  // 4. Send OTP endpoint
  app.post('/api/send-otp', otpLimiter, async (req, res) => {
    const { email, password, meta } = req.body;
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      return res.status(400).json({ error: 'Valid email address is required.' });
    }

    try {
      // Generate secure 6-digit numeric OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');
      const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes expiry

      const existingRecord = otpStore.get(email);

      otpStore.set(email, {
        otp: hashedOtp,
        plainOtp: otp,
        password: password || existingRecord?.password,
        meta: meta || existingRecord?.meta,
        expiresAt,
        attempts: 0,
      });

      console.log(`\n🔑 [AUTH-OTP] Generated 6-Digit Code for [${email}]: >>> ${otp} <<< (Expires in 10 mins)\n`);

      let emailSent = false;

      if (transporter && hasSmtp) {
        try {
          const mailOptions = {
            from: {
              name: process.env.BREVO_SENDER_NAME || 'JH Innovation Connect - Govt of Jharkhand',
              address: smtpFromAddress,
            },
            to: email,
            subject: 'Citizen Portal Login OTP - Government of Jharkhand',
            text: `Your Citizen Portal OTP is: ${otp}\nThis code expires in 10 minutes. Do not share it with anyone.`,
            html: `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><title>Citizen Portal Login OTP</title></head>
<body style="margin:0;padding:0;background:#fbf8ee;font-family:Arial,Helvetica,sans-serif;color:#24332b;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#fbf8ee;padding:30px 10px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e2d6bc;">
          <tr>
            <td style="padding:24px 30px;background:#0d5c3a;color:#ffffff;">
              <h2 style="margin:0;font-size:20px;color:#ffffff;">Government of Jharkhand</h2>
              <p style="margin:4px 0 0;font-size:12px;color:#e7dfcf;">Societal Innovation Collaboration Portal</p>
            </td>
          </tr>
          <tr>
            <td style="padding:32px 30px;background:#ffffff;">
              <p style="font-size:15px;color:#333333;margin:0 0 20px;">
                Hello, use the following One-Time Password (OTP) to verify your account:
              </p>
              <div style="background:#fbf8ee;border:2px dashed #0d5c3a;border-radius:12px;padding:20px;text-align:center;margin:20px 0;">
                <span style="font-family:monospace;font-size:36px;font-weight:bold;letter-spacing:8px;color:#0d5c3a;">
                  ${otp}
                </span>
              </div>
              <p style="font-size:12px;color:#666666;margin:20px 0 0;">
                This code is valid for 10 minutes. Do not share this OTP with anyone.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
          };

          const info = await transporter.sendMail(mailOptions);
          if (!info.rejected || info.rejected.length === 0) {
            emailSent = true;
            console.log(`✓ Email delivered to ${email} (MessageId: ${info.messageId})`);
          }
        } catch (smtpErr: any) {
          console.warn('⚠️ Live SMTP dispatch had an issue, fallback demoOtp activated:', smtpErr?.message || smtpErr);
        }
      }

      return res.json({
        success: true,
        message: emailSent ? 'OTP sent to your email.' : 'OTP generated successfully. (Demo/Auto-fill active)',
        demoOtp: otp,
        delivery: emailSent ? 'email' : 'demo_simulation',
      });
    } catch (error: any) {
      console.error('Error generating OTP:', error);
      return res.status(500).json({ error: 'Internal server error while generating OTP.' });
    }
  });

  // 5. Verify OTP endpoint
  app.post('/api/verify-otp', verifyLimiter, async (req, res) => {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ error: 'Email and 6-digit OTP are required.' });
    }

    const record = otpStore.get(email);
    if (!record) {
      return res.status(400).json({ error: 'No active OTP request found or code has expired. Please request a new OTP.' });
    }

    if (Date.now() > record.expiresAt) {
      otpStore.delete(email);
      return res.status(400).json({ error: 'OTP has expired. Please request a new code.' });
    }

    record.attempts = (record.attempts || 0) + 1;
    if (record.attempts > 5) {
      otpStore.delete(email);
      return res.status(400).json({ error: 'Too many invalid attempts. Please request a new OTP.' });
    }

    const hashedInput = crypto.createHash('sha256').update(otp.toString().trim()).digest('hex');
    const isMatch = (hashedInput === record.otp) || (otp.toString().trim() === record.plainOtp);

    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid OTP code. Please check the 6-digit code and try again.' });
    }

    // OTP is valid! Consume it
    otpStore.delete(email);

    const password = record.password || 'Citizen@12345!';
    const meta = record.meta || {};

    let userId = `user_${Date.now()}`;

    if (supabase) {
      try {
        const { data: rpcUserId, error: rpcError } = await supabase.rpc('create_verified_user', {
          p_email: email,
          p_password: password,
          p_meta: meta,
        });

        if (!rpcError && rpcUserId) {
          userId = rpcUserId;
          console.log(`✓ Citizen user created via RPC: ${email} -> ${userId}`);
        } else {
          if (rpcError?.code === '23505') {
            console.log(`ℹ️ User already registered in DB for ${email}`);
            return res.json({ success: true, message: 'Account verified. Please log in.', userId });
          }

          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: { data: meta },
          });

          if (!signUpError && signUpData?.user?.id) {
            userId = signUpData.user.id;
            console.log(`✓ Citizen user signed up via auth.signUp: ${email} -> ${userId}`);
          }
        }
      } catch (dbErr: any) {
        console.warn('⚠️ Supabase sync exception:', dbErr?.message || dbErr);
      }
    }

    return res.json({
      success: true,
      message: 'OTP verified successfully.',
      userId,
    });
  });

  // -----------------------------------------------------------------------------
  // VITE / STATIC SERVING
  // -----------------------------------------------------------------------------
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (_req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 JH Innovation Connect App Server running at http://0.0.0.0:${PORT}`);
  });
}

startAppServer().catch((err) => {
  console.error('Fatal server startup error:', err);
  process.exit(1);
});
