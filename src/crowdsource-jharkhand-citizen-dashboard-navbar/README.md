# Crowdsource Jharkhand — Citizen Dashboard (Navbar Version)

This package recreates the supplied navbar-based dashboard as real React UI.

## Included
- `CitizenDashboard.jsx`
- `citizen-dashboard.css`
- `assets/` with the visual crops from the supplied reference
- `reference-dashboard.png`
- this README

## Integration
Copy the JSX/CSS into your existing React application and copy `assets/` into `public/assets/`.

Then render:
```jsx
import CitizenDashboard from "./CitizenDashboard";
import "./citizen-dashboard.css";

export default function App() {
  return <CitizenDashboard />;
}
```

If your project already has routing, replace the `window.location.href` paths with your existing route/navigation helper rather than creating duplicate routes.

## Antigravity instruction
Use `reference-dashboard.png` as the exact visual reference. Integrate this implementation into the existing SIH Crowdsource Jharkhand project. Do not create a new project and do not replace unrelated files. Preserve authentication, backend APIs, routing, existing components and functionality. Replace only the citizen dashboard presentation/implementation where appropriate.

The latest reference uses a TOP NAVBAR, not a left sidebar. Keep the navbar layout exactly: Jharkhand emblem and Crowdsource Jharkhand branding at top-left, Dashboard, Report an Issue, My Reports, Discover Solutions, Notifications, then search, bell, and Aman Kumar profile on the right.

Preserve the cream/off-white visual system with rust/orange, amber, muted rose and gold accents. Do not introduce blue UI accents. Keep the heritage illustration, Jharkhand map, report thumbnails, and solution images from `public/assets`.

The dashboard must be built from actual React/HTML/CSS elements, not by using the screenshot as a background. Make buttons and existing navigation functional. Run the application and compare the result against the reference image before finishing.
