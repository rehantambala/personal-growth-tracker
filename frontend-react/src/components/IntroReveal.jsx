import { useEffect } from "react";
import "../styles/intro.css";

export default function IntroReveal({ onFinish }) {

  // wait — then enter main page
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 15000); // 15 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="intro-wrapper">

      <div className="intro-title">
        <span className="shine-mask">
          PERSONAL GROWTH TRACKER
        </span>
      </div>

    </div>
  );
}
