import React, { useState } from "react";
import "./CitizenLogin.css";

interface CitizenLoginProps {
  onLogin?: () => void;
}

const CitizenLogin: React.FC<CitizenLoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpSent, setOtpSent] = useState(false);

  const handleSendOtp = () => {
    if (!email) return;
    setOtpSent(true);
  };

  const handleOtpChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleLogin = () => {
    if (otp.join("").length === 6) {
      onLogin?.();
    }
  };

  return (
    <div className="citizen-login-card">

      {/* Header */}
      <div className="login-header">

        <div className="emblem-wrapper">
          <img
            src="/jharkhand-emblem.png"
            alt="Government of Jharkhand"
            className="jharkhand-emblem"
          />
        </div>

        <div className="government-name">
          Government of Jharkhand
        </div>

        <h1>
          <span>Societal Innovation</span>
          <strong>Collaboration Portal</strong>
        </h1>

        <div className="gold-divider">
          <span>◆</span>
        </div>

        <p className="tagline">
          Connecting Citizens. Empowering Innovation. Building Jharkhand.
        </p>
      </div>

      {/* Step 1 */}
      <section className="login-step">

        <div className="step-heading">
          <div className="step-number">1</div>

          <div className="step-icon">✉</div>

          <div>
            <h2>Enter Email ID</h2>
            <p>We'll send you a One-Time Password</p>
          </div>
        </div>

        <div className="input-wrapper">
          <span className="input-icon">✉</span>

          <input
            type="email"
            placeholder="Enter your Email ID"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <button
          className="gold-button"
          onClick={handleSendOtp}
          disabled={!email}
        >
          <span>Send OTP</span>
          <span className="button-arrow">→</span>
        </button>
      </section>

      {/* Connector */}
      <div className="step-connector">
        <span>⌄</span>
      </div>

      {/* Step 2 */}
      <section className="login-step">

        <div className="step-heading">
          <div className="step-number">2</div>

          <div className="step-icon shield">♢</div>

          <div>
            <h2>Enter OTP</h2>
            <p>
              Enter the 6-digit OTP sent to your email
            </p>
          </div>
        </div>

        <div className="otp-container">
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              className="otp-box"
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) =>
                handleOtpChange(e.target.value, index)
              }
            />
          ))}
        </div>

        <div className="resend-text">
          Didn't receive OTP?{" "}
          <button type="button">
            Resend OTP
          </button>
        </div>
      </section>

      {/* Connector */}
      <div className="step-connector">
        <span>⌄</span>
      </div>

      {/* Step 3 */}
      <section className="login-step final-step">

        <div className="step-heading">
          <div className="step-number">3</div>

          <div className="step-icon lock">♙</div>

          <div>
            <h2>Login</h2>
            <p>Enter the OTP to continue to the portal</p>
          </div>
        </div>

        <button
          className="gold-button login-button"
          onClick={handleLogin}
          disabled={!otpSent || otp.join("").length !== 6}
        >
          <span>Login</span>
          <span className="button-arrow">→</span>
        </button>
      </section>

      {/* Jharkhand decorative footer */}
      <div className="heritage-line">
        ✦ ─── ✧ ─── ✦ ─── ✧ ─── ✦
      </div>

      <div className="register-text">
        New to the portal?{" "}
        <button type="button">Register Now</button>
      </div>

    </div>
  );
};

export default CitizenLogin;
