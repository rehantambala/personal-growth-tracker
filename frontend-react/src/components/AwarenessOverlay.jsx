import React, { useState } from "react";
import "../styles/awareness.css";

export default function AwarenessOverlay({ entry, onSave, onSkip }) {

  // Hooks must ALWAYS be declared at top level
  const [tone, setTone] = useState("");
  const [lens, setLens] = useState("");
  const [context, setContext] = useState("");

  if (!entry) return null;

  function handleSubmit() {
    onSave({
      mood: tone || "neutral",
      category: context || "General",
      type: lens || "Reflection"
    });
  }

  return (
    <div className="awareness-overlay">

      <div className="awareness-panel">

        <h3 className="awareness-title">
          Add Awareness (Optional)
        </h3>

        <p className="awareness-sub">
          A gentle pause — label the meaning of this reflection
        </p>


        {/* Emotional Tone */}
        <div className="awareness-group">
          <p className="group-label">Emotional Tone</p>

          <div className="chip-row">
            {["happy","good","neutral","sad"].map(m => (
              <button
                key={m}
                className={`chip ${tone === m ? "active" : ""}`}
                onClick={() => setTone(m)}
              >
                {m}
              </button>
            ))}
          </div>
        </div>


        {/* Cognitive Lens */}
        <div className="awareness-group">
          <p className="group-label">Cognitive Lens</p>

          <div className="chip-row">
            {[
              "self-reflection",
              "re-evaluation",
              "acceptance",
              "processing"
            ].map(l => (
              <button
                key={l}
                className={`chip ${lens === l ? "active" : ""}`}
                onClick={() => setLens(l)}
              >
                {l}
              </button>
            ))}
          </div>
        </div>


        {/* Life Context */}
        <div className="awareness-group">
          <p className="group-label">Life Context</p>

          <div className="chip-row">
            {[
              "relationships",
              "growth",
              "identity",
              "transition"
            ].map(c => (
              <button
                key={c}
                className={`chip ${context === c ? "active" : ""}`}
                onClick={() => setContext(c)}
              >
                {c}
              </button>
            ))}
          </div>
        </div>


        {/* Actions */}
        <div className="awareness-actions">

          <button className="skip-btn" onClick={onSkip}>
            Skip
          </button>

          <button className="save-btn" onClick={handleSubmit}>
            Save Awareness
          </button>

        </div>

      </div>
    </div>
  );
}
