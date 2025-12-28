import React, { useState } from "react";
import "../styles/awareness.css";

export default function AwarenessOverlay({ entry, onClose, onSave }) {

  const [emotionTone, setEmotionTone] = useState(entry.emotionTone || null);
  const [cognitiveLens, setCognitiveLens] = useState(entry.cognitiveLens || null);
  const [lifeContext, setLifeContext] = useState(entry.lifeContext || null);

  const [saving, setSaving] = useState(false);

  async function handleSave() {

    setSaving(true);

    try {
      const res = await fetch(
        `http://localhost:4000/api/entries/${entry._id}/awareness`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            emotionTone,
            cognitiveLens,
            lifeContext
          })
        }
      );

      const data = await res.json();
      const updatedEntry = data.entry;

      // Send updated entry to parent - parent will close overlay
      onSave(updatedEntry);

    } catch (err) {
      console.error("Awareness save failed:", err);
      setSaving(false);  // Only reset saving state on error
    }

    // DON'T call onClose() here - parent handles it
  }

  function handleSkip() {
    onClose();
  }

  function toggle(setter, val, current) {
    setter(current === val ? null : val);
  }

  return (
    <div className="awareness-overlay">
      <div className="awareness-card">

        <h3>Add Awareness (Optional)</h3>

        <label>Emotional Tone</label>
        <div className="chip-row">
          {["happy","good","neutral","sad"].map(tone => (
            <button
              key={tone}
              className={`chip ${emotionTone === tone ? "selected" : ""}`}
              onClick={() => toggle(setEmotionTone, tone, emotionTone)}
            >
              {tone}
            </button>
          ))}
        </div>

        <label>Cognitive Lens</label>
        <div className="chip-row">
          {["self-reflection","re-evaluation","acceptance","processing"]
            .map(lens => (
              <button
                key={lens}
                className={`chip ${cognitiveLens === lens ? "selected" : ""}`}
                onClick={() => toggle(setCognitiveLens, lens, cognitiveLens)}
              >
                {lens}
              </button>
            ))}
        </div>

        <label>Life Context</label>
        <div className="chip-row">
          {["relationships","growth","identity","transition"]
            .map(ctx => (
              <button
                key={ctx}
                className={`chip ${lifeContext === ctx ? "selected" : ""}`}
                onClick={() => toggle(setLifeContext, ctx, lifeContext)}
              >
                {ctx}
              </button>
            ))}
        </div>

        <div className="awareness-actions">

          <button className="skip-btn" onClick={handleSkip}>
            Skip
          </button>

          <button
            className="save-btn"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving…" : "Save Awareness"}
          </button>

        </div>

      </div>
    </div>
  );
}