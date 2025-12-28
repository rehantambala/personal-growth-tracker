import React from "react";

export default function FloatingQuickActions({ onAdd }) {

  const goToAnalytics = () => {
    const el = document.getElementById("analytics");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const actions = [
    { icon: "⬆️", label: "Back to Top", onClick: () =>
      window.scrollTo({ top: 0, behavior: "smooth" })
    },
    { icon: "✨", label: "New Reflection", onClick: onAdd },
    { icon: "📊", label: "View Insights", onClick: goToAnalytics }
  ];

  return (
    <div className="floating-actions">
      {actions.map((a, i) => (
        <div key={i} className="fab-wrapper">
          <button className="fab-btn" onClick={a.onClick}>
            {a.icon}
          </button>
          <span className="fab-label">{a.label}</span>
        </div>
      ))}
    </div>
  );
}
