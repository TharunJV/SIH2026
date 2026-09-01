import React from "react";
import "./citizen-dashboard.css";

const ASSET = "/assets/";

const reports = [
  ["Road damaged near school", "Ranchi, Jharkhand", "Reported on 29 Aug 2024", "Updated 2 days ago", "In Progress", "progress", "road-report.jpg"],
  ["Streetlight not working", "Khunti, Jharkhand", "Reported on 27 Aug 2024", "Updated 4 days ago", "Under Review", "review", "streetlight-report.jpg"],
  ["Water shortage in community", "Gumla, Jharkhand", "Reported on 25 Aug 2024", "Updated 1 week ago", "Resolved", "resolved", "water-report.jpg"],
];

const solutions = [
  ["Smart Irrigation System", "Helping farmers save water and increase crop yield.", "Kolhan University", "Pilot Testing", "pilot", "irrigation-solution.jpg"],
  ["Waste Management Solution", "Turning waste into wealth for clean communities.", "BIT Sindri", "Deployed", "deployed", "waste-solution.jpg"],
  ["Solar Street Light", "Providing sustainable lighting in rural and urban areas.", "Ranchi University", "Implemented", "implemented", "solar-solution.jpg"],
];

export default function CitizenDashboard() {
  const go = (path) => { window.location.href = path; };

  return (
    <div className="citizen-dashboard">
      <header className="navbar">
        <button className="brand" onClick={() => go("/citizen/dashboard")}>
          <img src={ASSET + "jharkhand-seal.png"} alt="Jharkhand emblem" />
          <span>
            <small>Crowdsource</small>
            <strong>Jharkhand</strong>
            <em>Your Voice, Our Future</em>
          </span>
        </button>

        <nav className="main-nav">
          <Nav active icon="⌂" label="Dashboard" onClick={() => go("/citizen/dashboard")} />
          <Nav icon="✎" label="Report an Issue" onClick={() => go("/citizen/report")} />
          <Nav icon="▣" label="My Reports" onClick={() => go("/citizen/reports")} />
          <Nav icon="♧" label="Discover Solutions" onClick={() => go("/citizen/solutions")} />
          <Nav icon="♧" label="Notifications" badge="3" onClick={() => go("/citizen/notifications")} />
        </nav>

        <div className="nav-right">
          <div className="search">
            <input placeholder="Search anything..." />
            <span>⌕</span>
          </div>
          <button className="top-bell">♧<b>3</b></button>
          <button className="profile" onClick={() => go("/citizen/profile")}>
            <span className="avatar">AK</span>
            <span className="profile-text"><strong>Aman Kumar</strong><small>Citizen</small></span>
            <span className="down">⌄</span>
          </button>
        </div>
      </header>

      <main>
        <section className="welcome">
          <div>
            <h1>Namaste, Aman! <span>👋</span></h1>
            <p>Together we can build a better and innovative Jharkhand.</p>
          </div>
          <img src={ASSET + "top-heritage.png"} alt="" className="heritage" />
        </section>

        <section className="hero-grid">
          <button className="report-feature" onClick={() => go("/citizen/report")}>
            <div className="feature-icon">▤<i>+</i></div>
            <div className="feature-copy">
              <h2>Report a New Issue</h2>
              <p>See a problem in your area?<br />Report it and help us solve it.</p>
              <span>Report Now&nbsp; →</span>
            </div>
            <img src={ASSET + "report-map.png"} alt="" />
          </button>

          <div className="stats">
            <Stat icon="▤" num="12" label="Issues Reported" cls="orange" />
            <Stat icon="⌛" num="5" label="In Progress" cls="amber" />
            <Stat icon="▣" num="6" label="Under Review" cls="rose" />
            <Stat icon="✓" num="6" label="Resolved" cls="gold" />
          </div>
        </section>

        <section className="middle-grid">
          <section className="panel reports">
            <PanelHeader title="My Recent Reports" />
            {reports.map(([title, location, date, updated, status, cls, image]) => (
              <button className="report-row" key={title} onClick={() => go("/citizen/reports")}>
                <img src={ASSET + image} alt="" />
                <span className="report-detail">
                  <strong>{title}</strong>
                  <small>⌖ &nbsp;{location}</small>
                  <small>▣ &nbsp;{date}</small>
                </span>
                <span className="report-status">
                  <b className={"status " + cls}>• {status}</b>
                  <small>{updated}</small>
                </span>
                <span className="arrow">›</span>
              </button>
            ))}
          </section>

          <section className="panel notifications">
            <PanelHeader title="Recent Notifications" />
            <Notice icon="▤" title="Your issue has been assigned" text="Road damaged near school has been assigned to Ranchi University." time="2 days ago" />
            <Notice icon="⌛" title="Status updated" text="Your water shortage issue is now under solution development." time="4 days ago" />
            <Notice icon="✓" title="Issue resolved" text="Streetlight not working issue has been resolved successfully." time="5 days ago" />
          </section>

          <section className="panel impact">
            <PanelHeader title="Impact So Far" />
            <Impact icon="♧" value="8,246" label="People Benefited" />
            <Impact icon="♜" value="32" label="Solutions Developed" />
            <Impact icon="❧" value="18" label="Villages Impacted" />
            <Impact icon="♙" value="6" label="Projects Completed" />
          </section>
        </section>

        <section className="panel solutions">
          <PanelHeader title="Solutions Inspired by Citizens Like You" right="Explore All Solutions →" />
          <div className="solution-list">
            {solutions.map(([title, description, institution, status, cls, image]) => (
              <article className="solution-card" key={title}>
                <img src={ASSET + image} alt="" />
                <div>
                  <h3>{title}</h3>
                  <p>{description}</p>
                  <footer>
                    <small>♜ &nbsp;{institution}</small>
                    <b className={"status " + cls}>{status}</b>
                  </footer>
                </div>
              </article>
            ))}
            <button className="next">›</button>
          </div>
        </section>

        <footer className="bottom-cta">
          <div className="cta-icon">♥</div>
          <div>
            <strong>Thank you for being a changemaker.</strong>
            <span>Your reports help build a better, stronger, and innovative Jharkhand.</span>
          </div>
          <button onClick={() => go("/citizen/report")}>Report an Issue Now&nbsp; →</button>
        </footer>
      </main>
    </div>
  );
}

function Nav({ icon, label, active, badge, onClick }) {
  return <button className={"nav-link " + (active ? "active" : "")} onClick={onClick}>
    <span>{icon}</span>{label}{badge && <b>{badge}</b>}
  </button>;
}
function Stat({ icon, num, label, cls }) {
  return <article className="stat">
    <span className={"stat-icon " + cls}>{icon}</span>
    <strong>{num}</strong><small>{label}</small><a href="#">{`View all →`}</a>
  </article>;
}
function PanelHeader({ title, right = "View All →" }) {
  return <div className="panel-header"><h2>{title}</h2><a href="#">{right}</a></div>;
}
function Notice({ icon, title, text, time }) {
  return <article className="notice">
    <span>{icon}</span><div><strong>{title}</strong><p>{text}</p><small>{time}</small></div>
  </article>;
}
function Impact({ icon, value, label }) {
  return <article className="impact-item"><span>{icon}</span><div><strong>{value}</strong><small>{label}</small></div></article>;
}
