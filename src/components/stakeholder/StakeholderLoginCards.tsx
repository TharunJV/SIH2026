import React, { FormEvent, useMemo, useState } from "react";

/**
 * JH Innovation Connect
 * Stakeholder Login Cards
 *
 * This single TSX file contains 5 separate role-specific login cards:
 * 1. University / HEI
 * 2. Faculty / Mentor
 * 3. Industry / CSR / Partner
 * 4. Startup / MSME
 * 5. Government / Admin
 *
 * Citizen / Community is intentionally NOT included.
 *
 * Usage:
 *   import {
 *     UniversityLogin,
 *     FacultyMentorLogin,
 *     IndustryPartnerLogin,
 *     StartupMSMELogin,
 *     GovernmentAdminLogin,
 *   } from "./StakeholderLoginCards";
 *
 * You can use any component directly as a page.
 */

export type RoleKey =
  | "university"
  | "faculty"
  | "industry"
  | "startup"
  | "government";

type RoleConfig = {
  key: RoleKey;
  eyebrow: string;
  title: string;
  subtitle: string;
  icon: string;
  accent: string;
  accentSoft: string;
  glow: string;
  loginLabel: string;
  identityLabel: string;
  identityPlaceholder: string;
  identityType: "email" | "text";
  securityNote: string;
};

const ROLE_CONFIG: Record<RoleKey, RoleConfig> = {
  university: {
    key: "university",
    eyebrow: "ACADEMIA & R&D",
    title: "UNIVERSITY / HEI",
    subtitle: "Access institutional challenges, research opportunities and student innovation projects.",
    icon: "🎓",
    accent: "#4F46E5",
    accentSoft: "#EEF2FF",
    glow: "rgba(79, 70, 229, 0.22)",
    loginLabel: "Institutional Email",
    identityLabel: "Institutional Email / HEI ID",
    identityPlaceholder: "Enter institutional email or HEI ID",
    identityType: "email",
    securityNote: "Authorized institutional access only",
  },

  faculty: {
    key: "faculty",
    eyebrow: "MENTORSHIP & ADVISORY",
    title: "FACULTY / MENTOR",
    subtitle: "Mentor student teams, review proposals and guide real-world innovation projects.",
    icon: "🏅",
    accent: "#0284C7",
    accentSoft: "#E0F2FE",
    glow: "rgba(2, 132, 199, 0.22)",
    loginLabel: "Official Email",
    identityLabel: "Official Email / Faculty ID",
    identityPlaceholder: "Enter official email or faculty ID",
    identityType: "email",
    securityNote: "Faculty access is verified by the institution",
  },

  industry: {
    key: "industry",
    eyebrow: "SPONSORS & DEPLOYMENT",
    title: "INDUSTRY / CSR / PARTNER",
    subtitle: "Fund, mentor, co-develop and support deployment of high-impact solutions.",
    icon: "💼",
    accent: "#9333EA",
    accentSoft: "#FAE8FF",
    glow: "rgba(147, 51, 234, 0.22)",
    loginLabel: "Business Email",
    identityLabel: "Business Email / Partner ID",
    identityPlaceholder: "Enter business email or partner ID",
    identityType: "email",
    securityNote: "Verified organisation access",
  },

  startup: {
    key: "startup",
    eyebrow: "SCALE & COMMERCIALIZATION",
    title: "STARTUP / MSME",
    subtitle: "Discover challenges, build solutions and scale innovations with public impact.",
    icon: "🚀",
    accent: "#EA580C",
    accentSoft: "#FFF7ED",
    glow: "rgba(234, 88, 12, 0.24)",
    loginLabel: "Business Email",
    identityLabel: "Business Email / Startup ID",
    identityPlaceholder: "Enter business email or startup ID",
    identityType: "email",
    securityNote: "Verified startup / MSME access",
  },

  government: {
    key: "government",
    eyebrow: "POLICY & VALIDATION",
    title: "GOVERNMENT / ADMIN",
    subtitle: "Validate challenges, coordinate stakeholders and monitor measurable public impact.",
    icon: "🛡️",
    accent: "#B77900",
    accentSoft: "#FFF8E1",
    glow: "rgba(183, 121, 0, 0.24)",
    loginLabel: "Official Government ID",
    identityLabel: "Official Government Email / ID",
    identityPlaceholder: "Enter official government email or ID",
    identityType: "email",
    securityNote: "Restricted government administration access",
  },
};

function EyeIcon({ visible }: { visible: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      {visible ? (
        <>
          <path
            d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <circle cx="12" cy="12" r="2.8" stroke="currentColor" strokeWidth="1.8" />
        </>
      ) : (
        <>
          <path
            d="M3 3l18 18"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M10.6 6.15A10.2 10.2 0 0 1 12 6c6 0 9.5 6 9.5 6a17 17 0 0 1-3.1 3.7M6.1 6.9C3.75 8.45 2.5 12 2.5 12s3.5 6 9.5 6c1.05 0 2.03-.18 2.93-.48"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      )}
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5 12h13M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BackArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M19 12H6M12 5l-7 7 7 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="5" y="10" width="14" height="11" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path d="m8 12 2.6 2.6L16.5 9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function StakeholderLogin({
  role,
  onLogin,
  onForgotPassword,
  onBack,
}: {
  role: RoleKey;
  onLogin?: (data: { identity: string; password: string; role: RoleKey }) => void;
  onForgotPassword?: (role: RoleKey) => void;
  onBack?: () => void;
}) {
  const config = ROLE_CONFIG[role];
  const [identity, setIdentity] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [forgotBanner, setForgotBanner] = useState(false);

  const isGovernment = role === "government";

  const pageStyle = useMemo(
    () =>
      ({
        "--role-accent": config.accent,
        "--role-soft": config.accentSoft,
        "--role-glow": config.glow,
      }) as React.CSSProperties,
    [config]
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!identity.trim() || !password.trim()) {
      setError("Please enter your login ID and password.");
      return;
    }

    onLogin?.({ identity: identity.trim(), password, role });
  };

  const handleForgotPassword = () => {
    if (onForgotPassword) {
      onForgotPassword(role);
    } else {
      setForgotBanner(true);
      setTimeout(() => setForgotBanner(false), 5000);
    }
  };

  return (
    <main className="jh-login-page" style={pageStyle}>
      <style>{`
        .jh-login-page {
          min-height: 100vh;
          width: 100%;
          box-sizing: border-box;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 42px 20px;
          position: relative;
          overflow: hidden;
          background:
            radial-gradient(circle at 50% 12%, var(--role-soft) 0%, transparent 32%),
            #f8fafc;
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          color: #0f172a;
        }

        .jh-login-page *,
        .jh-login-page *::before,
        .jh-login-page *::after {
          box-sizing: border-box;
        }

        .jh-login-page::before {
          content: "";
          position: absolute;
          width: 520px;
          height: 520px;
          border-radius: 50%;
          top: -250px;
          left: -220px;
          background: var(--role-soft);
          filter: blur(3px);
          opacity: .8;
        }

        .jh-login-page::after {
          content: "";
          position: absolute;
          width: 420px;
          height: 420px;
          border-radius: 50%;
          right: -210px;
          bottom: -210px;
          background: var(--role-soft);
          opacity: .55;
        }

        .jh-login-shell {
          position: relative;
          z-index: 2;
          width: min(100%, 470px);
        }

        .jh-back-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 14px;
          padding: 6px 12px;
          border-radius: 10px;
          border: 0;
          background: rgba(255,255,255,.65);
          backdrop-filter: blur(4px);
          color: #64748b;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: color .18s ease, background .18s ease;
        }

        .jh-back-link:hover {
          color: var(--role-accent);
          background: rgba(255,255,255,.9);
        }

        .jh-brand {
          text-align: center;
          margin-bottom: 18px;
        }

        .jh-brand-name {
          margin: 0;
          font-size: 15px;
          font-weight: 850;
          letter-spacing: .08em;
          text-transform: uppercase;
          color: #0f172a;
        }

        .jh-brand-line {
          width: 52px;
          height: 3px;
          border-radius: 99px;
          background: var(--role-accent);
          margin: 10px auto 0;
        }

        .jh-login-card {
          background: rgba(255,255,255,.97);
          border: 1.5px solid color-mix(in srgb, var(--role-accent) 72%, #dbe3ed);
          border-radius: 26px;
          overflow: hidden;
          box-shadow:
            0 24px 65px rgba(15, 23, 42, .12),
            0 0 0 6px color-mix(in srgb, var(--role-accent) 9%, transparent);
        }

        .jh-login-header {
          padding: 27px 28px 25px;
          background: linear-gradient(135deg, var(--role-soft), #ffffff 82%);
          border-bottom: 1px solid #dbe3ed;
        }

        .jh-role-row {
          display: flex;
          align-items: flex-start;
          gap: 15px;
        }

        .jh-role-icon {
          width: 54px;
          height: 54px;
          flex: 0 0 54px;
          border-radius: 16px;
          display: grid;
          place-items: center;
          font-size: 25px;
          background: var(--role-accent);
          color: white;
          box-shadow: 0 9px 20px var(--role-glow);
        }

        .jh-eyebrow {
          display: inline-flex;
          align-items: center;
          min-height: 25px;
          padding: 5px 10px;
          border-radius: 999px;
          background: #fff;
          border: 1px solid color-mix(in srgb, var(--role-accent) 25%, #e2e8f0);
          color: var(--role-accent);
          font-size: 10px;
          font-weight: 850;
          letter-spacing: .075em;
          margin-bottom: 7px;
        }

        .jh-role-title {
          margin: 0;
          font-size: clamp(20px, 4vw, 25px);
          line-height: 1.1;
          letter-spacing: -.025em;
          font-weight: 900;
          color: #111827;
        }

        .jh-role-subtitle {
          margin: 10px 0 0;
          color: #64748b;
          font-size: 13px;
          line-height: 1.55;
        }

        .jh-login-body {
          padding: 28px;
        }

        .jh-field {
          margin-bottom: 18px;
        }

        .jh-field-label {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
          font-size: 12px;
          font-weight: 800;
          color: #334155;
        }

        .jh-input-wrap {
          position: relative;
        }

        .jh-input {
          width: 100%;
          height: 50px;
          border: 1.5px solid #cbd5e1;
          border-radius: 12px;
          outline: none;
          background: #fff;
          padding: 0 15px;
          color: #0f172a;
          font-size: 14px;
          transition: border .18s ease, box-shadow .18s ease, transform .18s ease;
        }

        .jh-input.has-eye {
          padding-right: 50px;
        }

        .jh-input::placeholder {
          color: #94a3b8;
        }

        .jh-input:focus {
          border-color: var(--role-accent);
          box-shadow: 0 0 0 4px color-mix(in srgb, var(--role-accent) 12%, transparent);
        }

        .jh-eye {
          position: absolute;
          top: 50%;
          right: 13px;
          transform: translateY(-50%);
          width: 34px;
          height: 34px;
          border: 0;
          border-radius: 9px;
          background: transparent;
          color: #64748b;
          display: grid;
          place-items: center;
          cursor: pointer;
        }

        .jh-eye:hover {
          background: var(--role-soft);
          color: var(--role-accent);
        }

        .jh-options {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
          margin: 2px 0 20px;
        }

        .jh-remember {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #64748b;
          font-size: 12px;
          cursor: pointer;
          user-select: none;
        }

        .jh-checkbox {
          width: 16px;
          height: 16px;
          accent-color: var(--role-accent);
          cursor: pointer;
        }

        .jh-forgot {
          border: 0;
          background: transparent;
          color: var(--role-accent);
          font-size: 12px;
          font-weight: 800;
          cursor: pointer;
          padding: 4px;
        }

        .jh-forgot:hover {
          text-decoration: underline;
        }

        .jh-error {
          padding: 11px 12px;
          border-radius: 10px;
          margin-bottom: 15px;
          background: #fff1f2;
          border: 1px solid #fecdd3;
          color: #be123c;
          font-size: 12px;
          font-weight: 700;
        }

        .jh-forgot-banner {
          padding: 11px 12px;
          border-radius: 10px;
          margin-bottom: 15px;
          background: var(--role-soft);
          border: 1px solid color-mix(in srgb, var(--role-accent) 30%, #e2e8f0);
          color: var(--role-accent);
          font-size: 12px;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .jh-login-button {
          width: 100%;
          min-height: 51px;
          border: 0;
          border-radius: 12px;
          background: var(--role-accent);
          color: #fff;
          font-size: 14px;
          font-weight: 900;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          box-shadow: 0 10px 22px var(--role-glow);
          transition: transform .18s ease, box-shadow .18s ease, filter .18s ease;
        }

        .jh-login-button:hover {
          transform: translateY(-2px);
          filter: brightness(.97);
          box-shadow: 0 14px 28px var(--role-glow);
        }

        .jh-login-button:active {
          transform: translateY(0);
        }

        .jh-security {
          margin-top: 20px;
          padding-top: 17px;
          border-top: 1px solid #e2e8f0;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 7px;
          color: #64748b;
          font-size: 11px;
          font-weight: 700;
          text-align: center;
        }

        .jh-security svg {
          color: var(--role-accent);
          flex: 0 0 auto;
        }

        .jh-footer {
          margin-top: 15px;
          text-align: center;
          color: #94a3b8;
          font-size: 10px;
          line-height: 1.5;
        }

        .jh-footer strong {
          color: #64748b;
        }

        @media (max-width: 520px) {
          .jh-login-page {
            padding: 25px 14px;
          }

          .jh-login-header,
          .jh-login-body {
            padding: 23px 20px;
          }

          .jh-login-card {
            border-radius: 21px;
          }

          .jh-role-icon {
            width: 48px;
            height: 48px;
            flex-basis: 48px;
          }

          .jh-options {
            align-items: flex-start;
            flex-direction: column;
          }
        }
      `}</style>

      <section className="jh-login-shell" aria-label={`${config.title} login`}>
        {/* Back to Role Selection */}
        {onBack && (
          <button type="button" className="jh-back-link" onClick={onBack}>
            <BackArrowIcon />
            <span>Back to Role Selection</span>
          </button>
        )}

        <div className="jh-brand">
          <p className="jh-brand-name">JH Innovation Connect</p>
          <div className="jh-brand-line" />
        </div>

        <div className="jh-login-card">
          <header className="jh-login-header">
            <div className="jh-role-row">
              <div className="jh-role-icon" aria-hidden="true">
                {config.icon}
              </div>

              <div>
                <div className="jh-eyebrow">{config.eyebrow}</div>
                <h1 className="jh-role-title">{config.title}</h1>
                <p className="jh-role-subtitle">{config.subtitle}</p>
              </div>
            </div>
          </header>

          <form className="jh-login-body" onSubmit={handleSubmit}>
            {/* Forgot Password Banner */}
            {forgotBanner && (
              <div className="jh-forgot-banner">
                <LockIcon />
                <span>Password recovery will be available through your registered official account.</span>
              </div>
            )}

            <div className="jh-field">
              <label className="jh-field-label" htmlFor={`${role}-identity`}>
                <span>{config.identityLabel}</span>
              </label>

              <input
                id={`${role}-identity`}
                className="jh-input"
                type={config.identityType}
                value={identity}
                onChange={(e) => setIdentity(e.target.value)}
                placeholder={config.identityPlaceholder}
                autoComplete="username"
              />
            </div>

            <div className="jh-field">
              <label className="jh-field-label" htmlFor={`${role}-password`}>
                <span>Password</span>
              </label>

              <div className="jh-input-wrap">
                <input
                  id={`${role}-password`}
                  className="jh-input has-eye"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                />

                <button
                  type="button"
                  className="jh-eye"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <EyeIcon visible={showPassword} />
                </button>
              </div>
            </div>

            <div className="jh-options">
              <label className="jh-remember">
                <input
                  className="jh-checkbox"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                Remember me
              </label>

              <button
                type="button"
                className="jh-forgot"
                onClick={handleForgotPassword}
              >
                Forgot Password?
              </button>
            </div>

            {error && <div className="jh-error">{error}</div>}

            <button type="submit" className="jh-login-button">
              Login
              <ArrowIcon />
            </button>

            <div className="jh-security">
              <LockIcon />
              <span>{config.securityNote}</span>
            </div>
          </form>
        </div>

        <div className="jh-footer">
          <strong>Government of Jharkhand</strong> · JH Innovation Connect
          {isGovernment ? " · Restricted Administration Portal" : ""}
        </div>
      </section>
    </main>
  );
}

/* -------------------------------------------------------------------------- */
/* Separate role components                                                   */
/* -------------------------------------------------------------------------- */

export function UniversityLogin(props: {
  onLogin?: (data: { identity: string; password: string; role: RoleKey }) => void;
  onForgotPassword?: (role: RoleKey) => void;
  onBack?: () => void;
}) {
  return <StakeholderLogin role="university" {...props} />;
}

export function FacultyMentorLogin(props: {
  onLogin?: (data: { identity: string; password: string; role: RoleKey }) => void;
  onForgotPassword?: (role: RoleKey) => void;
  onBack?: () => void;
}) {
  return <StakeholderLogin role="faculty" {...props} />;
}

export function IndustryPartnerLogin(props: {
  onLogin?: (data: { identity: string; password: string; role: RoleKey }) => void;
  onForgotPassword?: (role: RoleKey) => void;
  onBack?: () => void;
}) {
  return <StakeholderLogin role="industry" {...props} />;
}

export function StartupMSMELogin(props: {
  onLogin?: (data: { identity: string; password: string; role: RoleKey }) => void;
  onForgotPassword?: (role: RoleKey) => void;
  onBack?: () => void;
}) {
  return <StakeholderLogin role="startup" {...props} />;
}

export function GovernmentAdminLogin(props: {
  onLogin?: (data: { identity: string; password: string; role: RoleKey }) => void;
  onForgotPassword?: (role: RoleKey) => void;
  onBack?: () => void;
}) {
  return <StakeholderLogin role="government" {...props} />;
}

/* -------------------------------------------------------------------------- */
/* Optional router helper                                                     */
/* -------------------------------------------------------------------------- */

export function StakeholderLoginByRole({
  role,
  onLogin,
  onForgotPassword,
  onBack,
}: {
  role: RoleKey;
  onLogin?: (data: { identity: string; password: string; role: RoleKey }) => void;
  onForgotPassword?: (role: RoleKey) => void;
  onBack?: () => void;
}) {
  return (
    <StakeholderLogin
      role={role}
      onLogin={onLogin}
      onForgotPassword={onForgotPassword}
      onBack={onBack}
    />
  );
}
