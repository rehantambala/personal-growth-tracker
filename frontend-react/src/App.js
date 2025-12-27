import React, { useState, useEffect } from "react";

import SplashIntro from "./components/SplashIntro";
import HeroScene from "./components/HeroScene";
import EntriesSection from "./components/EntriesSection";
import NewEntryModal from "./components/NewEntryModal";   // ✅ add back

export default function App() {

  // ===== INTRO STATE =====
  const [showIntro, setShowIntro] = useState(true);

  // ===== ENTRY STATE =====
  const [entries, setEntries] = useState([]);
  const [showModal, setShowModal] = useState(false);


  // ===== SAVE NEW ENTRY (TEMP LOCAL PUSH) =====
  const handleSaveEntry = async (entry) => {
    setEntries(prev => [entry, ...prev]);
    // (later we also send to backend)
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
      {/* ===== CINEMATIC INTRO ===== */}
      {showIntro && (
        <SplashIntro onFinish={() => setShowIntro(false)} />
      )}

      {/* ===== MAIN APP AFTER INTRO ===== */}
      {!showIntro && (
        <>
          <HeroScene />

          {/* Pass entries to list */}
          <EntriesSection entries={entries} />

          {/* ===== MODAL ===== */}
          {showModal && (
            <NewEntryModal
              onClose={() => setShowModal(false)}
              onSave={handleSaveEntry}
            />
          )}

         
        </>
      )}
    </>
  );
}
