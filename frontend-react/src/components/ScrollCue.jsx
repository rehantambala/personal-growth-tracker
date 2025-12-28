import React from "react";
import "../styles/scrollcue.css";

export default function ScrollCue() {
  return (
    <div className="scroll-cue-container">

      <p className="scroll-text">
        Scroll to begin recording your journey
      </p>

      {/* Curved path */}
      <div className="scroll-curve" />

      {/* Breathing downward arrow */}
      <div className="scroll-arrow">
        ↓
      </div>

    </div>
  );
}
