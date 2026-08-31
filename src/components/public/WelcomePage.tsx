import React from "react";
import "./WelcomePage.css";

interface WelcomePageProps {
  onEnter?: () => void;
}

export const WelcomePage: React.FC<WelcomePageProps> = ({ onEnter }) => {
  return (
    <main className="welcome-page">
      {/* Background */}
      <div className="welcome-background" />

      {/* Cinematic overlay */}
      <div className="welcome-overlay" />

      {/* Header */}
      <header className="welcome-header">
        <button className="menu-button" aria-label="Open menu">
          <span />
          <span />
          <span />
        </button>
      </header>

      {/* Main Hero */}
      <section className="welcome-content">
        <h1 className="welcome-title">
          <span className="title-white">Where Jharkhand’s</span>
          <span className="title-gold">
            Challenges Meet Innovation
          </span>
        </h1>

        <p className="welcome-subtitle">
          A collaborative platform for solving societal challenges.
        </p>

        <button
          className="enter-button"
          onClick={onEnter}
          type="button"
        >
          <svg
            width="23"
            height="23"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M14 8L18 12L14 16"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M18 12H4"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            <path
              d="M20 5V19"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>

          <span>Enter Portal</span>
        </button>

        {/* Three Motivational Statements */}
        <div className="innovation-points">

          <div className="innovation-point">
            <div className="point-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9 18H15"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <path
                  d="M10 21H14"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <path
                  d="M8.3 14.5C7.45 13.65 7 12.5 7 11.2C7 8.3 9.25 6 12 6C14.75 6 17 8.3 17 11.2C17 12.5 16.55 13.65 15.7 14.5C15.05 15.15 15 16 15 16H9C9 16 8.95 15.15 8.3 14.5Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M12 2V3"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <path
                  d="M4.9 4.9L5.6 5.6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <path
                  d="M19.1 4.9L18.4 5.6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <div>
              <h3>Together We Innovate</h3>
              <p>Ideas for Impact</p>
            </div>
          </div>

          <div className="point-divider" />

          <div className="innovation-point">
            <div className="point-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="9"
                  cy="8"
                  r="3"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <circle
                  cx="17"
                  cy="9"
                  r="2.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M3.5 19C3.5 15.9 5.9 13.5 9 13.5C12.1 13.5 14.5 15.9 14.5 19"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <path
                  d="M14 14C14.8 13.5 15.8 13.2 17 13.2C19.8 13.2 22 15.3 22 18"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <div>
              <h3>Together We Transform</h3>
              <p>Collaboration for Change</p>
            </div>
          </div>

          <div className="point-divider" />

          <div className="innovation-point">
            <div className="point-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4 19V10"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <path
                  d="M10 19V6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <path
                  d="M16 19V12"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <path
                  d="M3 19H21"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <path
                  d="M14 7L17 4L20 7"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M17 4V10"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <div>
              <h3>Together We Build a Better Jharkhand</h3>
              <p>Solutions for Tomorrow</p>
            </div>
          </div>

        </div>

        {/* Bottom Quote */}
        <div className="welcome-quote">
          <span className="quote-line" />
          <p>
            “Every challenge is an opportunity to build a better tomorrow.”
          </p>
          <span className="quote-line" />
        </div>
      </section>
    </main>
  );
};

export default WelcomePage;
