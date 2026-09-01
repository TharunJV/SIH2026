import React, { useState } from "react";
import "./CitizenLogin.css";

interface CitizenLoginProps {
  onLogin?: () => void;
  onRegisterClick?: () => void;
}

const CitizenLogin: React.FC<CitizenLoginProps> = ({ onLogin, onRegisterClick }) => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSendOtp = async () => {
    if (!email) return;
    setLoading(true);
    setErrorMsg("");
    try {
      const response = await fetch("http://localhost:3001/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to send OTP");
      }
      setOtpSent(true);
      setOtp(["", "", "", "", "", ""]);
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
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

  const handleLogin = async () => {
    const otpValue = otp.join("");
    if (otpValue.length === 6) {
      setLoading(true);
      setErrorMsg("");
      try {
        const response = await fetch("http://localhost:3001/api/verify-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otp: otpValue }),
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "Invalid OTP");
        }
        onLogin?.();
      } catch (err: any) {
        setErrorMsg(err.message);
      } finally {
        setLoading(false);
      }
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

      {errorMsg && (
        <div style={{ color: "#e53e3e", textAlign: "center", marginBottom: "10px", fontSize: "12px", fontWeight: "bold", padding: "8px", backgroundColor: "#fff5f5", borderRadius: "6px" }}>
          {errorMsg}
        </div>
      )}

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
            disabled={loading}
          />
        </div>

        <button
          className="gold-button"
          onClick={handleSendOtp}
          disabled={!email || loading}
        >
          <span>{loading && !otpSent ? "Sending..." : (otpSent ? "Resend OTP" : "Send OTP")}</span>
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
              disabled={!otpSent || loading}
            />
          ))}
        </div>

        <div className="resend-text">
          Didn't receive OTP?{" "}
          <button type="button" onClick={handleSendOtp} disabled={loading || !email}>
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
          disabled={!otpSent || otp.join("").length !== 6 || loading}
        >
          <span>{loading && otpSent ? "Verifying..." : "Login"}</span>
          <span className="button-arrow">→</span>
        </button>
      </section>

      {/* Jharkhand decorative footer */}
      <div className="heritage-line">
        ✦ ─── ✧ ─── ✦ ─── ✧ ─── ✦
      </div>

      <div className="register-text">
        New to the portal?{" "}
        <button type="button" onClick={onRegisterClick}>Register Now</button>
      </div>

    </div>
  );
};

export default CitizenLogin;
