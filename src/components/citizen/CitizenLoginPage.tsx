import React, { useState } from "react";
import CitizenLogin from "./CitizenLogin";
import CitizenRegister from "./CitizenRegister";
import { useApp } from "../../context/AppContext";

interface CitizenLoginPageProps {
  initialRegisterMode?: boolean;
}

export const CitizenLoginPage: React.FC<CitizenLoginPageProps> = ({ initialRegisterMode = false }) => {
  const { switchRole, setCurrentView, showToast } = useApp();
  const [isRegisterMode, setIsRegisterMode] = useState(initialRegisterMode);

  const handleLoginSuccess = () => {
    switchRole("citizen");
    showToast(
      "success",
      "Citizen Login Successful",
      "Welcome to the Citizen Portal & Dashboard."
    );
    setCurrentView("citizen-dashboard");
  };

  const handleRegisterSuccess = () => {
    switchRole("citizen");
    showToast(
      "success",
      "Registration Successful",
      "Citizen Account created. Welcome to your Dashboard!"
    );
    setCurrentView("citizen-dashboard");
  };

  return (
    <div className="relative w-full min-h-[calc(100vh-140px)] flex items-center justify-center py-2 px-2 sm:px-4 overflow-hidden rounded-3xl my-0">
      {/* Layer 1: Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
        src="/videos/jharkhand-cinematic.mp4"
        onError={(e) => {
          // If background video is missing, hide video tag and rely on fallback background image
          (e.target as HTMLElement).style.display = "none";
        }}
      />

      {/* Layer 1 (Fallback Image): Assembly background */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0 filter brightness-75 saturate-120"
        style={{ backgroundImage: 'url("/images/jharkhand-assembly.jpg")' }}
      />

      {/* Layer 2: Dark / Subtle Overlay */}
      <div className="absolute inset-0 bg-black/55 backdrop-blur-[2px] z-10" />

      {/* Layer 3 & 4: Centered Citizen Login or Registration Card */}
      <div className="relative z-20 flex justify-center items-center w-full max-w-full my-auto py-2">
        {isRegisterMode ? (
          <CitizenRegister
            onLoginClick={() => setIsRegisterMode(false)}
            onRegisterSuccess={handleRegisterSuccess}
          />
        ) : (
          <CitizenLogin
            onLogin={handleLoginSuccess}
            onRegisterClick={() => setIsRegisterMode(true)}
          />
        )}
      </div>
    </div>
  );
};

export default CitizenLoginPage;
