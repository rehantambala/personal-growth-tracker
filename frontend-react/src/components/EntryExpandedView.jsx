import React, { useState } from "react";
import "../styles/entries.css";

export default function EntryExpandedView({ entry, onClose }) {

  // 🟢 Hooks must always run (even if entry = null)
  const [deepMode, setDeepMode] = useState(false);

  // if entry not loaded yet — do not render UI
  if (!entry) return null;

  // 🗓 Safe date handling
  const date = new Date(entry.createdAt || entry.date).toLocaleString();

  return (
    <div className={`expanded-overlay ${deepMode ? "deep-mode" : ""}`}>

      <div className="expanded-panel">

        {/* Close */}
        <button className="expanded-close" onClick={onClose}>
          ✕
        </button>

        {/* Title */}
        <h2 className="expanded-title">
          {entry.title || "Untitled Reflection"}
        </h2>

        {/* Date */}
        <span className="expanded-date">{date}</span>

        {/* Deep Mode Toggle */}
        <button
          className="deep-mode-btn"
          onClick={() => setDeepMode(prev => !prev)}
        >
          {deepMode ? "Exit Deep Mode" : "Enter Deep Mode"}
        </button>

        {/* Reflection Body */}
        <p className="expanded-body">
          {(entry.content || entry.note || "").trim() || "— no text —"}
        </p>

      </div>

    </div>
  );
}
