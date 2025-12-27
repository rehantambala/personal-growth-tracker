import React, { useState } from "react";
import "../styles/entries.css";

export default function NewEntryModal({ isOpen, onClose, onSave }) {

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  if (!isOpen) return null; // keep DOM clean when closed

  const handleSubmit = () => {
    if (!content.trim()) return;

    const newEntry = {
      title: title || "Untitled Reflection",
      content,
      createdAt: new Date().toISOString()
    };

    onSave(newEntry);
    setTitle("");
    setContent("");
    onClose();
  };

  return (
    <div className="modal-overlay">

      <div className="modal-panel">

        <h3 className="modal-title">
          New Reflection
        </h3>

        <input
          className="modal-input"
          placeholder="Title (optional)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          className="modal-textarea"
          placeholder="Let your thoughts flow…"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <div className="modal-actions">

          <button className="modal-cancel" onClick={onClose}>
            Cancel
          </button>

          <button className="modal-save" onClick={handleSubmit}>
            Save Reflection
          </button>

        </div>

      </div>

    </div>
  );
}
