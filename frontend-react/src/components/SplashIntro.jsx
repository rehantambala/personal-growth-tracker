

import React, { useEffect, useRef, useState } from "react";
import "../styles/splash.css";

import whoosh from "../assets/audio/intro_whoosh.mp3";

export default function SplashIntro({ onFinish }) {

  const title = "PERSONAL GROWTH TRACKER";

  const [show, setShow] = useState(true);
  const [visibleLetters, setVisibleLetters] = useState(0);
  const [finished, setFinished] = useState(false);
  const [awaitingTap, setAwaitingTap] = useState(true);

  // 🔊 Web Audio API
  const audioCtxRef = useRef(null);
  const bufferRef = useRef(null);
  const sourceRef = useRef(null);
  const gainRef = useRef(null);

  // 🎵 Load audio (decoded + ready)
  useEffect(() => {
    audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();

    fetch(whoosh)
      .then(res => res.arrayBuffer())
      .then(data => audioCtxRef.current.decodeAudioData(data))
      .then(decoded => {
        bufferRef.current = decoded;
      })
      .catch(err => console.warn("Audio load failed", err));
  }, []);

  // 🌫 Fade-in ambience on start
  function fadeInAudio() {
    if (!bufferRef.current || !audioCtxRef.current) return;

    const ctx = audioCtxRef.current;
    const source = ctx.createBufferSource();
    const gain = ctx.createGain();

    source.buffer = bufferRef.current;
    source.connect(gain);
    gain.connect(ctx.destination);

    gain.gain.value = 0;
    source.start(0);

    sourceRef.current = source;
    gainRef.current = gain;

    gain.gain.linearRampToValueAtTime(
      0.35,
      ctx.currentTime + 0.8
    );
  }

  // 🌫 Fade-out ambience at exit
  function fadeOutAudio() {
    if (!audioCtxRef.current || !gainRef.current) return;

    const ctx = audioCtxRef.current;
    const gain = gainRef.current;

    gain.gain.linearRampToValueAtTime(
      0,
      ctx.currentTime + 0.5
    );

    setTimeout(() => {
      try { sourceRef.current?.stop(); } catch(_) {}
    }, 600);
  }

  // 🎬 Intro sequence (runs AFTER tap)
  useEffect(() => {

    // wait for user tap
    if (awaitingTap) return;

    if (visibleLetters < title.length) {

      const t = setTimeout(() => {
        setVisibleLetters(v => v + 1);
      }, 90);

      return () => clearTimeout(t);
    }

    // when final letter finishes
    fadeInAudio();

    const t2 = setTimeout(() => {

      setFinished(true);
      fadeOutAudio();

      setTimeout(() => {
        setShow(false);
        onFinish();
      }, 900);

    }, 1400);

    return () => clearTimeout(t2);

  }, [visibleLetters, awaitingTap]);


  if (!show) return null;


  return (
    <div className={`splash-overlay dissolve ${finished ? "fade-out" : ""}`}>

      <div className="dust-layer" />

      <div className={`splash-zoom ${finished ? "zoom-pass" : ""}`}>

        <h1 className="splash-title">
          {title.split("").map((char, i) => (
            <span
              key={i}
              className={`splash-letter ${
                i < visibleLetters ? "visible" : ""
              }`}
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </h1>

      </div>

      {/* Tap to begin button */}
      {awaitingTap && (
        <button
          className="tap-to-enter"
          onClick={() => setAwaitingTap(false)}
        >
          Tap to Begin
        </button>
      )}

    </div>
  );
}
