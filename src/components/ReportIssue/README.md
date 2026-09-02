# ReportIssue — Jharkhand Civic Innovation Portal

## What is included

- `ReportIssue.tsx` — complete 4-step React + TypeScript report workflow.
- `ReportIssue.css` — matching cream / green / orange civic-tech design.
- One parent component; the four steps are horizontal slides, not separate routes.
- Smooth horizontal transition when Next / Back is clicked.
- Progress stepper with completed/current states.
- Live location using the browser Geolocation API.
- Rear-camera capture on supported mobile browsers using `capture="environment"`.
- Photo/video and document upload.
- Form validation for the important fields.

## Install

Copy the `ReportIssue` folder into your React project's `src/components` (or another components folder).

Then import it:

```tsx
import ReportIssue from "./components/ReportIssue/ReportIssue";
```

Render:

```tsx
<ReportIssue />
```

If your project already has a shared header/navigation, remove the `ri-topbar` and `ri-subnav` blocks from `ReportIssue.tsx` and keep the main workflow.

## API integration

The demo submit handler currently logs the form data and shows an alert. Replace the `submit()` function with your existing API request.

The report object contains:

- title
- category
- subCategory
- description
- state
- district
- blockCity
- villageWard
- exactLocation
- latitude
- longitude
- noticedDate
- frequency
- affected
- immediateAction
- photos
- documents

## Important

Browser camera and GPS permissions require a secure context when deployed (HTTPS). `localhost` is normally allowed for development.

The location is stored as latitude/longitude alongside the report. This is generally easier to use for your map, dashboard and backend than modifying EXIF metadata.
