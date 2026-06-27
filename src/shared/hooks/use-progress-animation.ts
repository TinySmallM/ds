import { useEffect, useRef } from 'react';

export const useProgressAnimation = (progress: number) => {
  const fillRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let animationFrameId: number;

    const animate = () => {
      if (fillRef.current) {
        fillRef.current.style.width = `${progress}%`;
      }
      if (textRef.current) {
        textRef.current.textContent = `${progress}%`;
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [progress]);

  return { fillRef, textRef };
};