import { useState, useEffect } from "react";

export function useMouseParallax(sensitivity = 15) {
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Only enable on non-touch devices
    const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isTouch) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = ((e.clientX / innerWidth) - 0.5) * sensitivity;
      const y = ((e.clientY / innerHeight) - 0.5) * sensitivity;
      setCoords({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [sensitivity]);

  return coords;
}
