import React, { useState, useEffect, useRef } from "react";
import "../styles/entries.css";
import { computeDepth } from "../utils/depthScore";

export default function EntryExpandedView({ entry, onClose }) {

  const [deepMode, setDeepMode] = useState(false);
  const bodyRef = useRef(null);


  // ✨ Scroll-reveal effect for body text
  useEffect(() => {
    const el = bodyRef.current;
    if (!el) return;

    el.classList.add("reveal-ready");

    const observer = new IntersectionObserver(
      ([item]) => {
        if (item.isIntersecting) {
          el.classList.add("revealed");
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  if (!entry) return null;

  const date = new Date(entry.createdAt || entry.date).toLocaleString();

  const depth = computeDepth(entry);

  return (
    <div
      className={`expanded-overlay ${deepMode ? "deep-mode" : ""}`}
      onClick={onClose}
    >
      <div
        className="expanded-panel cinematic-panel"
        onClick={(e) => e.stopPropagation()}
      >

        {/* Close button */}
        <button className="expanded-close" onClick={onClose}>✕</button>

        {/* Title */}
        <h2 className="expanded-title">
          {entry.title || "Untitled Reflection"}
        </h2>

        {/* Date */}
        <span className="expanded-date">{date}</span>

        {/* Deep Mode Toggle */}
        <button
          className="deep-mode-btn"
          onClick={() => setDeepMode(v => !v)}
        >
          {deepMode ? "Exit Deep Mode" : "Enter Deep Mode"}
        </button>

        {/* Body */}
        <p ref={bodyRef} className="expanded-body scroll-reveal">
          {(entry.content || entry.note || "").trim() || "— no text —"}
        </p>
<div className="depth-score">
  Reflection Depth: <strong>{depth}/10</strong>
</div>

      </div>
    </div>
    
  );
}
