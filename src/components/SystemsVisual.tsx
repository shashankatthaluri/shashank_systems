"use client";

import { useEffect, useRef } from "react";

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
}

export default function SystemsVisual() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000, radius: 120 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    let nodes: Node[] = [];

    const handleResize = () => {
      if (!canvas || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      width = rect.width;
      height = rect.height || 400;

      // Adjust for retina displays
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);

      // Re-initialize nodes based on screen size
      const nodeCount = Math.floor((width * height) / 8000) || 15;
      nodes = Array.from({ length: nodeCount }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 2.5 + 1.5,
        color: Math.random() > 0.85 ? "#e06a3b" : "#8e9bb0",
      }));
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouseRef.current.x = -1000;
      mouseRef.current.y = -1000;
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw subtle background guide circles (represents orbital system states)
      ctx.strokeStyle = "rgba(29, 39, 58, 0.08)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, Math.min(width, height) * 0.35, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, Math.min(width, height) * 0.2, 0, Math.PI * 2);
      ctx.stroke();

      const mouse = mouseRef.current;

      // Update and draw nodes
      nodes.forEach((node) => {
        // Float movement
        node.x += node.vx;
        node.y += node.vy;

        // Bounce on borders
        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;

        // Keep inside bounds
        node.x = Math.max(0, Math.min(width, node.x));
        node.y = Math.max(0, Math.min(height, node.y));

        // Interaction with mouse (soft gravity pull)
        const dx = mouse.x - node.x;
        const dy = mouse.y - node.y;
        const dist = Math.hypot(dx, dy);

        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          node.x -= (dx / dist) * force * 0.5;
          node.y -= (dy / dist) * force * 0.5;
        }

        // Draw particle node
        ctx.fillStyle = node.color;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fill();

        // Node Glow if orange
        if (node.color === "#e06a3b") {
          ctx.shadowBlur = 8;
          ctx.shadowColor = "#e06a3b";
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.radius + 1, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(224, 106, 59, 0.3)";
          ctx.fill();
          ctx.shadowBlur = 0; // reset shadow
        }
      });

      // Draw connections
      const maxDistance = 100;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const n1 = nodes[i];
          const n2 = nodes[j];
          const dist = Math.hypot(n1.x - n2.x, n1.y - n2.y);

          if (dist < maxDistance) {
            const alpha = (maxDistance - dist) / maxDistance;
            
            // Check if connection is near the mouse (creates a glowing highlighted state)
            const midX = (n1.x + n2.x) / 2;
            const midY = (n1.y + n2.y) / 2;
            const mouseDist = Math.hypot(mouse.x - midX, mouse.y - midY);

            if (mouseDist < mouse.radius * 0.8) {
              // Active orange system path
              ctx.strokeStyle = `rgba(224, 106, 59, ${alpha * 0.4})`;
              ctx.lineWidth = 1.2;
            } else {
              // Muted grey system path
              ctx.strokeStyle = `rgba(29, 39, 58, ${alpha * 0.25})`;
              ctx.lineWidth = 0.8;
            }

            ctx.beginPath();
            ctx.moveTo(n1.x, n1.y);
            ctx.lineTo(n2.x, n2.y);
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", handleResize);
      if (canvas) {
        canvas.removeEventListener("mousemove", handleMouseMove);
        canvas.removeEventListener("mouseleave", handleMouseLeave);
      }
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full min-h-[350px] relative overflow-hidden select-none">
      {/* Background technical layout details */}
      <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none" />
      <canvas ref={canvasRef} className="absolute inset-0 cursor-crosshair" />
      {/* HUD UI Elements */}
      <div className="absolute bottom-4 right-4 flex items-center gap-2 font-mono text-[9px] text-text-muted select-none pointer-events-none">
        <span className="h-1.5 w-1.5 bg-accent rounded-full animate-ping" />
        <span>SYS_CORE_ACTIVE (60FPS)</span>
      </div>
    </div>
  );
}
