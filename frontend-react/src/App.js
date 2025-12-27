import React, { useState, useEffect } from "react";

import NewEntryModal from "./components/NewEntryModal";

import HeroScene from "./components/HeroScene";
import EntriesSection from "./components/EntriesSection";

export default function App() {

  // ===== STATE =====
  const [entries, setEntries] = useState([]);
  const [showModal, setShowModal] = useState(false);


  // ===== SAVE NEW ENTRY (TEMP LOCAL PUSH) =====
  const handleSaveEntry = async (entry) => {
    setEntries(prev => [entry, ...prev]);

    // TODO: later send to backend
  };


  // ===== FETCH EXISTING DB ENTRIES =====
  useEffect(() => {
    fetch("http://localhost:4000/api/entries")
      .then(res => res.json())
      .then(data => setEntries(data.entries || []))
      .catch(err => console.error("API fetch error:", err));
  }, []);


  return (
    <>
      <HeroScene />

      <EntriesSection entries={entries} />


      {/* ===== MODAL (SHOW WHEN TRUE) ===== */}
      {showModal && (
        <NewEntryModal
          onClose={() => setShowModal(false)}
          onSave={handleSaveEntry}
        />
      )}


      {/* ===== FLOAT ACTION BUTTON ===== */}
      <button
        className="add-entry-btn"
        onClick={() => setShowModal(true)}
      >
        ✨ New Reflection
      </button>
    </>
  );
}
