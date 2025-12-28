import React, { useState, useRef } from "react";

export default function NewEntryModal({ onClose, onSave }) {

  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [mood, setMood] = useState("neutral");
  const [saving, setSaving] = useState(false);

  // button ripple ref (React-safe)
  const saveBtnRef = useRef(null);


  async function handleSave() {

    // 🚫 prevent empty entries
    if (!title.trim() || !note.trim()) {
      alert("Please add both a title and note");
      return;
    }

    // ✨ ripple animation (safe)
    const btn = saveBtnRef.current;
    if (btn) {
      btn.classList.add("clicked");
      setTimeout(() => btn.classList.remove("clicked"), 500);
    }

    setSaving(true);

    try {

      // 🟢 save entry to backend
      const res = await fetch("http://localhost:4000/api/entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          note: note.trim(),
          mood,
          category: "General",
          type: "Reflection"
        })
      });

      const data = await res.json();
      const savedEntry = data.entry || data;

      // 🔁 send entry back to parent UI
      onSave(savedEntry);

      // close modal AFTER save
      onClose();

    } catch (err) {
      console.error("Failed to save entry:", err);
      alert("Failed to save reflection. Please try again.");
    } finally {
      setSaving(false);
    }
  }


  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="modal-header">
          <h2>“ Begin Your Reflection ”</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>


        {/* Body */}
        <div className="modal-body">

          <label className="modal-label">
            Give this moment a name
          </label>

          <input
            type="text"
            placeholder="Give this reflection a name…"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
          />


          <label className="modal-label">
            Let your thoughts flow here…
          </label>

          <textarea
            placeholder="Start writing your thoughts…"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows="8"
          />


          <label className="modal-label">
            How did this moment feel?
          </label>

          <div className="mood-row">
            {["happy", "good", "neutral", "sad"].map(m => (
              <button
                key={m}
                className={`mood-chip ${mood === m ? "selected" : ""}`}
                onClick={() => setMood(m)}
              >
                {m}
              </button>
            ))}
          </div>

        </div>


        {/* Footer */}
        <div className="modal-actions">

          <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button>

          <button
            ref={saveBtnRef}
            className="save-btn"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save & Continue"}
          </button>

        </div>

      </div>
    </div>
  );
}
