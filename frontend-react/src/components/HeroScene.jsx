import React, { useEffect } from "react";
import "../styles/hero.css";
import ScrollCue from "./ScrollCue";


export default function HeroScene() {

  useEffect(() => {
    const hero = document.querySelector(".hero-scene");
    const rings = document.querySelectorAll(".breath-ring");

    const handleScroll = () => {
      const y = window.scrollY;
      if (!hero) return;

      hero.style.transform = `translateY(${y * -0.08}px)`;
      hero.style.filter = `blur(${y * 0.01}px)`;

      rings.forEach(r => {
        r.style.transform = `scale(${1 + y * 0.0004})`;
        r.style.opacity = `${0.22 - y * 0.0003}`;
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="hero-scene">

      <div className="ambient-layer">
        <div className="breath-ring ring-left" />
        <div className="breath-ring ring-right" />
      </div>

      <div className="hero-content">

        <p className="label">EMBRACE THE JOURNEY</p>

        <h1 className="hero-title">
          The Echoes of Your <span className="accent">Inner Landscape</span>
        </h1>

        <div className="hero-buttons">
          <button className="primary-btn">Begin Your Path</button>
          <button className="secondary-btn">Learn More</button>
        </div>


      </div>
      <ScrollCue />
    </section>
  );
}
