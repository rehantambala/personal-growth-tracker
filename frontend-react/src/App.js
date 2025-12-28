import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SplashIntro from "./components/SplashIntro";
import HeroScene from "./components/HeroScene";
import EntriesSection from "./components/EntriesSection";

export default function App() {

  // ===== INTRO STATE =====
  const [showIntro, setShowIntro] = useState(true);

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
          
          {/* EntriesSection manages its own entries */}
          <EntriesSection />
        </>
      )}
    </>
  );
}