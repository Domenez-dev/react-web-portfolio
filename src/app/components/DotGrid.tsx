import { useEffect, useRef, useCallback } from "react";

interface DotGridProps {
  isDark: boolean;
  scrollOffset?: number; // 0-1 normalized scroll position
}

interface Dot {
  originX: number;
  originY: number;
  x: number;
  y: number;
  scale: number;
}

const DOT_SPACING = 32;
const DOT_RADIUS = 1.2;
const INFLUENCE_RADIUS = 200;
const MAX_DISPLACEMENT = 10;
const EASE_SPEED = 0.08;
const RETURN_SPEED = 0.06;
const PARALLAX_FACTOR = 0.4;

export default function DotGrid({ isDark, scrollOffset = 0 }: DotGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dotsRef = useRef<Dot[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000, active: false });
  const rafRef = useRef<number>(0);
  const parallaxXRef = useRef(0);
  const targetParallaxXRef = useRef(0);

  const buildGrid = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    // Make canvas wider to allow parallax movement
    const w = window.innerWidth * 1.4;
    const h = window.innerHeight;
    canvas.width = w;
    canvas.height = h;

    const cols = Math.ceil(w / DOT_SPACING) + 1;
    const rows = Math.ceil(h / DOT_SPACING) + 1;

    const offsetX = (w - (cols - 1) * DOT_SPACING) / 2;
    const offsetY = (h - (rows - 1) * DOT_SPACING) / 2;

    const dots: Dot[] = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const ox = offsetX + c * DOT_SPACING;
        const oy = offsetY + r * DOT_SPACING;
        dots.push({ originX: ox, originY: oy, x: ox, y: oy, scale: 1 });
      }
    }
    dotsRef.current = dots;
  }, []);

  useEffect(() => {
    buildGrid();

    const onResize = () => buildGrid();
    window.addEventListener("resize", onResize);

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.active = true;
    };

    const onMouseLeave = () => {
      mouseRef.current.active = false;
    };

    window.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseleave", onMouseLeave);

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [buildGrid]);

  // Update parallax target when scrollOffset changes
  useEffect(() => {
    const maxShift = window.innerWidth * PARALLAX_FACTOR;
    targetParallaxXRef.current = -scrollOffset * maxShift;
  }, [scrollOffset]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const animate = () => {
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);

      // Smooth parallax easing
      parallaxXRef.current +=
        (targetParallaxXRef.current - parallaxXRef.current) * 0.12;

      const dots = dotsRef.current;
      const mouse = mouseRef.current;
      // Adjust mouse position relative to parallax offset
      const adjustedMouseX = mouse.x - parallaxXRef.current;

      for (let i = 0; i < dots.length; i++) {
        const dot = dots[i];
        let targetScale = 1;

        if (mouse.active) {
          const dx = adjustedMouseX - dot.originX;
          const dy = mouse.y - dot.originY;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < INFLUENCE_RADIUS) {
            const force = 1 - dist / INFLUENCE_RADIUS;

            if (isDark) {
              // Dark mode: magnetic pull toward cursor
              const targetX =
                dot.originX + (dx / dist) * MAX_DISPLACEMENT * force * force;
              const targetY =
                dot.originY + (dy / dist) * MAX_DISPLACEMENT * force * force;
              dot.x += (targetX - dot.x) * EASE_SPEED;
              dot.y += (targetY - dot.y) * EASE_SPEED;
            } else {
              // Light mode: repel away from cursor + zoom
              const repelForce = force * force;
              const targetX =
                dot.originX - (dx / dist) * MAX_DISPLACEMENT * 1.8 * repelForce;
              const targetY =
                dot.originY - (dy / dist) * MAX_DISPLACEMENT * 1.8 * repelForce;
              dot.x += (targetX - dot.x) * EASE_SPEED;
              dot.y += (targetY - dot.y) * EASE_SPEED;
              targetScale = 1 + repelForce * 3.5; // zoom up to 4.5x at center
            }
          } else {
            dot.x += (dot.originX - dot.x) * RETURN_SPEED;
            dot.y += (dot.originY - dot.y) * RETURN_SPEED;
          }
        } else {
          dot.x += (dot.originX - dot.x) * RETURN_SPEED;
          dot.y += (dot.originY - dot.y) * RETURN_SPEED;
        }

        // Ease the scale
        dot.scale += (targetScale - dot.scale) * EASE_SPEED;

        const r = DOT_RADIUS * dot.scale;
        const alpha = isDark ? 0.15 : 0.08;
        const fillColor = isDark
          ? `rgba(255, 255, 255, ${alpha})`
          : `rgba(0, 0, 0, ${Math.min(alpha + (dot.scale - 1) * 0.05, 0.35)})`;

        ctx.fillStyle = fillColor;
        ctx.beginPath();
        ctx.arc(dot.x + parallaxXRef.current, dot.y, r, 0, Math.PI * 2);
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isDark]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "140%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
}
