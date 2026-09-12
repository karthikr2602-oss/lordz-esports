import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export const CustomCursor = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouch, setIsTouch] = useState(true);

  useEffect(() => {
    // Disable on touch / mobile devices
    const touchCheck = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    setIsTouch(touchCheck);
    if (touchCheck) return;

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);

      // Check if hovering over interactive elements
      const target = e.target as HTMLElement | null;
      if (target) {
        const interactive = target.closest("button, a, input, [role='button'], .cursor-pointer, .interactive-hover, .gold-glow-card");
        setIsHovered(!!interactive);
      }
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [isVisible]);

  if (isTouch || !isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
      {/* Outer subtle follower ring */}
      <motion.div
        className="fixed rounded-full border border-[#FFBE32]/60 bg-[#FFBE32]/10 backdrop-blur-[1px]"
        animate={{
          x: position.x - (isHovered ? 24 : 14),
          y: position.y - (isHovered ? 24 : 14),
          width: isHovered ? 48 : 28,
          height: isHovered ? 48 : 28,
          scale: isHovered ? 1.15 : 1,
        }}
        transition={{
          type: "spring",
          damping: 28,
          stiffness: 350,
          mass: 0.4,
        }}
      />
      {/* Center pinpoint dot */}
      <motion.div
        className="fixed rounded-full bg-[#FFBE32] shadow-[0_0_8px_#FFBE32]"
        animate={{
          x: position.x - 3,
          y: position.y - 3,
          width: 6,
          height: 6,
          scale: isHovered ? 0.5 : 1,
        }}
        transition={{
          type: "spring",
          damping: 40,
          stiffness: 800,
        }}
      />
    </div>
  );
};
