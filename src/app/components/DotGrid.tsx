import { useEffect, useRef, useCallback } from "react";

interface DotGridProps {
  isDark: boolean;
}

interface Dot {
  originX: number;
  originY: number;
  x: number;
  y: number;
  scale: number;
}

const DOT_SPACING = 21;
const DOT_RADIUS = 0.8;
const INFLUENCE_RADIUS = 134;
const INFLUENCE_RADIUS_SQ = INFLUENCE_RADIUS * INFLUENCE_RADIUS;
const MAX_DISPLACEMENT = 7;
const EASE_SPEED = 0.08;
const RETURN_SPEED = 0.06;
const SETTLE_THRESHOLD = 0.05;
const TWO_PI = Math.PI * 2;

export default function DotGrid({ isDark }: DotGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dotsRef = useRef<Dot[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000, active: false });
  const rafRef = useRef<number>(0);
  const isDarkRef = useRef(isDark);

  isDarkRef.current = isDark;

  const buildGrid = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const w = window.innerWidth;
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

  const drawStatic = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dark = isDarkRef.current;
    const dots = dotsRef.current;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = dark
      ? "rgba(255, 255, 255, 0.15)"
      : "rgba(0, 0, 0, 0.08)";
    ctx.beginPath();
    for (let i = 0; i < dots.length; i++) {
      const dot = dots[i];
      ctx.moveTo(dot.originX + DOT_RADIUS, dot.originY);
      ctx.arc(dot.originX, dot.originY, DOT_RADIUS, 0, TWO_PI);
    }
    ctx.fill();
  }, []);

  const startLoop = useCallback(() => {
    if (rafRef.current) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const animate = () => {
      const dark = isDarkRef.current;
      const dots = dotsRef.current;
      const mouse = mouseRef.current;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let settled = true;

      for (let i = 0; i < dots.length; i++) {
        const dot = dots[i];
        let targetScale = 1;

        if (mouse.active) {
          const dx = mouse.x - dot.originX;
          const dy = mouse.y - dot.originY;
          const distSq = dx * dx + dy * dy;

          if (distSq < INFLUENCE_RADIUS_SQ) {
            const dist = Math.sqrt(distSq);
            const force = 1 - dist / INFLUENCE_RADIUS;
            const f = force * force;

            if (dark) {
              dot.x +=
                (dot.originX + (dx / dist) * MAX_DISPLACEMENT * f - dot.x) *
                EASE_SPEED;
              dot.y +=
                (dot.originY + (dy / dist) * MAX_DISPLACEMENT * f - dot.y) *
                EASE_SPEED;
            } else {
              dot.x +=
                (dot.originX - (dx / dist) * MAX_DISPLACEMENT * 1.8 * f - dot.x) *
                EASE_SPEED;
              dot.y +=
                (dot.originY - (dy / dist) * MAX_DISPLACEMENT * 1.8 * f - dot.y) *
                EASE_SPEED;
              targetScale = 1 + f * 3.5;
            }
            settled = false;
          } else {
            const rx = dot.originX - dot.x;
            const ry = dot.originY - dot.y;
            dot.x += rx * RETURN_SPEED;
            dot.y += ry * RETURN_SPEED;
            if (rx * rx + ry * ry > SETTLE_THRESHOLD * SETTLE_THRESHOLD)
              settled = false;
          }
        } else {
          const rx = dot.originX - dot.x;
          const ry = dot.originY - dot.y;
          dot.x += rx * RETURN_SPEED;
          dot.y += ry * RETURN_SPEED;
          if (rx * rx + ry * ry > SETTLE_THRESHOLD * SETTLE_THRESHOLD)
            settled = false;
        }

        const scaleDelta = targetScale - dot.scale;
        dot.scale += scaleDelta * EASE_SPEED;
        if (Math.abs(scaleDelta) > SETTLE_THRESHOLD) settled = false;
      }

      // Batched draw
      if (dark) {
        ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
        ctx.beginPath();
        for (let i = 0; i < dots.length; i++) {
          const dot = dots[i];
          const r = DOT_RADIUS * dot.scale;
          ctx.moveTo(dot.x + r, dot.y);
          ctx.arc(dot.x, dot.y, r, 0, TWO_PI);
        }
        ctx.fill();
      } else {
        ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
        ctx.beginPath();
        for (let i = 0; i < dots.length; i++) {
          const dot = dots[i];
          if (dot.scale < 1.01) {
            ctx.moveTo(dot.x + DOT_RADIUS, dot.y);
            ctx.arc(dot.x, dot.y, DOT_RADIUS, 0, TWO_PI);
          }
        }
        ctx.fill();

        for (let i = 0; i < dots.length; i++) {
          const dot = dots[i];
          if (dot.scale >= 1.01) {
            const r = DOT_RADIUS * dot.scale;
            ctx.fillStyle = `rgba(0, 0, 0, ${Math.min(0.08 + (dot.scale - 1) * 0.05, 0.35)})`;
            ctx.beginPath();
            ctx.arc(dot.x, dot.y, r, 0, TWO_PI);
            ctx.fill();
          }
        }
      }

      if (settled) {
        rafRef.current = 0;
        drawStatic();
        return;
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
  }, [drawStatic]);

  useEffect(() => {
    buildGrid();
    drawStatic();

    const onResize = () => {
      buildGrid();
      drawStatic();
    };
    window.addEventListener("resize", onResize);

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.active = true;
      startLoop();
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
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = 0;
      }
    };
  }, [buildGrid, drawStatic, startLoop]);

  useEffect(() => {
    drawStatic();
    startLoop();
  }, [isDark, drawStatic, startLoop]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
}
