import React from "react";
import {
  UniversityLogin,
  FacultyMentorLogin,
  IndustryPartnerLogin,
  StartupMSMELogin,
  GovernmentAdminLogin,
} from "./StakeholderLoginCards";
import { useApp } from "../../context/AppContext";
import type { RoleKey } from "./StakeholderLoginCards";
import type { UserRole } from "../../types";

/**
 * Mapping from the StakeholderLoginCards RoleKey to the
 * existing AppContext UserRole + target dashboard view.
 */
const ROLE_DASHBOARD_MAP: Record<
  RoleKey,
  { userRole: UserRole; dashboardView: string }
> = {
  university: { userRole: "university_admin", dashboardView: "university-dashboard" },
  faculty: { userRole: "faculty_mentor", dashboardView: "university-dashboard" },
  industry: { userRole: "csr_org", dashboardView: "industry-dashboard" },
  startup: { userRole: "industry_msme", dashboardView: "industry-dashboard" },
  government: { userRole: "govt_department", dashboardView: "government-dashboard" },
};

export const StakeholderLoginPage: React.FC = () => {
  const { stakeholderLoginRole, switchRole, setCurrentView, showToast } = useApp();

  // Fallback: if no role set, go back to role-selection
  if (!stakeholderLoginRole) {
    setCurrentView("role-selection");
    return null;
  }

  const mapping = ROLE_DASHBOARD_MAP[stakeholderLoginRole];

  const handleLogin = (data: { identity: string; password: string; role: RoleKey }) => {
    // Switch the app role and navigate to the dashboard
    switchRole(mapping.userRole);
    showToast(
      "success",
      "Authentication Successful",
      `Welcome! Accessing ${data.role.charAt(0).toUpperCase() + data.role.slice(1)} portal.`
    );
    setCurrentView(mapping.dashboardView as any);
  };

  const handleForgotPassword = (_role: RoleKey) => {
    showToast(
      "info",
      "Password Recovery",
      "Password recovery will be available through your registered official account."
    );
  };

  const handleBack = () => {
    setCurrentView("role-selection");
  };

  // Render the correct login component based on stakeholderLoginRole
  const loginProps = {
    onLogin: handleLogin,
    onForgotPassword: handleForgotPassword,
    onBack: handleBack,
  };

  switch (stakeholderLoginRole) {
    case "university":
      return <UniversityLogin {...loginProps} />;
    case "faculty":
      return <FacultyMentorLogin {...loginProps} />;
    case "industry":
      return <IndustryPartnerLogin {...loginProps} />;
    case "startup":
      return <StartupMSMELogin {...loginProps} />;
    case "government":
      return <GovernmentAdminLogin {...loginProps} />;
    default:
      return null;
  }
};

export default StakeholderLoginPage;
