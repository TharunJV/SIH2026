import React from "react";
import CitizenLogin from "./CitizenLogin";
import { useApp } from "../../context/AppContext";

export const CitizenLoginPage: React.FC = () => {
  const { switchRole, setCurrentView, showToast } = useApp();

  const handleLoginSuccess = () => {
    switchRole("citizen");
    showToast(
      "success",
      "Citizen Login Successful",
      "Welcome to the Citizen Portal & Dashboard."
    );
    setCurrentView("citizen-dashboard");
  };

  return (
    <div className="relative w-full min-h-[calc(100vh-110px)] flex items-center justify-center py-4 px-2 sm:px-4 overflow-hidden rounded-3xl my-1">
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

      {/* Layer 3 & 4: Centered Citizen Login Card & UI */}
      <div className="relative z-20 flex justify-center items-center w-full max-w-full my-auto">
        <CitizenLogin onLogin={handleLoginSuccess} />
      </div>
    </div>
  );
};

export default CitizenLoginPage;
