import { useEffect, useRef, useState, useCallback } from 'react';

interface CustomCursorProps {
  isDark: boolean;
}

const LERP_FACTOR = 0.15;

export default function CustomCursor({ isDark }: CustomCursorProps) {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const rafRef = useRef<number>(0);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [useSvgCursor, setUseSvgCursor] = useState(false);

  // Try loading cursor.svg to see if the user provided one
  useEffect(() => {
    const img = new Image();
    img.onload = () => setUseSvgCursor(true);
    img.onerror = () => setUseSvgCursor(false);
    img.src = '/cursor.svg';
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    mousePos.current.x = e.clientX;
    mousePos.current.y = e.clientY;
    if (!isVisible) setIsVisible(true);
  }, [isVisible]);

  const handleMouseLeave = useCallback(() => {
    setIsVisible(false);
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    const onMouseDown = () => setIsClicking(true);
    const onMouseUp = () => setIsClicking(false);

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('button, a, [data-cursor-hover], .cursor-pointer, input, .group')) {
        setIsHovering(true);
      }
    };
    const onMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('button, a, [data-cursor-hover], .cursor-pointer, input, .group')) {
        setIsHovering(false);
      }
    };

    document.addEventListener('mouseover', onMouseOver);
    document.addEventListener('mouseout', onMouseOut);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('mouseout', onMouseOut);
    };
  }, [handleMouseMove, handleMouseLeave, handleMouseEnter]);

  useEffect(() => {
    const animate = () => {
      const dot = dotRef.current;
      const ring = ringRef.current;
      if (!dot || !ring) {
        rafRef.current = requestAnimationFrame(animate);
        return;
      }

      // Dot follows exactly
      dot.style.transform = `translate(${mousePos.current.x}px, ${mousePos.current.y}px) translate(-50%, -50%) scale(${
        isClicking ? 0.6 : isHovering ? 1.5 : 1
      })`;

      // Ring follows with lerp
      ringPos.current.x += (mousePos.current.x - ringPos.current.x) * LERP_FACTOR;
      ringPos.current.y += (mousePos.current.y - ringPos.current.y) * LERP_FACTOR;

      ring.style.transform = `translate(${ringPos.current.x}px, ${ringPos.current.y}px) translate(-50%, -50%) scale(${
        isClicking ? 0.7 : isHovering ? 0.6 : 1
      })`;

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isHovering, isClicking]);

  const color = isDark ? '#ffffff' : '#000000';

  // If using SVG cursor, show the image as the cursor dot
  if (useSvgCursor) {
    return (
      <>
        <div
          ref={dotRef}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: 24,
            height: 24,
            pointerEvents: 'none',
            zIndex: 99999,
            opacity: isVisible ? 1 : 0,
            transition: 'opacity 0.15s ease',
            willChange: 'transform',
          }}
        >
          <img
            src="/cursor.svg"
            alt=""
            style={{
              width: '100%',
              height: '100%',
              filter: isDark ? 'invert(1)' : 'none',
              transition: 'filter 0.3s ease',
            }}
          />
        </div>
        <div
          ref={ringRef}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: 28,
            height: 28,
            border: `1px solid ${color}`,
            borderRadius: '50%',
            pointerEvents: 'none',
            zIndex: 99999,
            opacity: isVisible ? 0.6 : 0,
            transition: 'opacity 0.15s ease, border-color 0.3s ease',
            willChange: 'transform',
          }}
        />
      </>
    );
  }

  return (
    <>
      {/* Inner dot */}
      <div
        ref={dotRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 6,
          height: 6,
          backgroundColor: color,
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 99999,
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 0.15s ease, background-color 0.3s ease',
          willChange: 'transform',
        }}
      />
      {/* Outer ring */}
      <div
        ref={ringRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 28,
          height: 28,
          border: `1px solid ${color}`,
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 99999,
          opacity: isVisible ? 0.6 : 0,
          transition: 'opacity 0.15s ease, border-color 0.3s ease',
          willChange: 'transform',
        }}
      />
    </>
  );
}
