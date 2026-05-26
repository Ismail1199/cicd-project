import React, { useEffect, useRef } from 'react';

export default function Confetti({ trigger }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!trigger) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;

    // Resize canvas to full window size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = [
      '#10b981', // Emerald
      '#0ea5e9', // Blue
      '#f43f5e', // Rose
      '#8b5cf6', // Violet
      '#f59e0b', // Amber
      '#ec4899', // Pink
    ];

    let particles = [];

    // Create particles
    const particleCount = 100;
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * -canvas.height - 20, // Spawn offscreen top
        size: Math.random() * 8 + 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        speedX: Math.random() * 4 - 2,
        speedY: Math.random() * 5 + 3,
        rotation: Math.random() * 360,
        rotationSpeed: Math.random() * 10 - 5,
        opacity: 1
      });
    }

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const updateAndRender = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;

      particles.forEach((p) => {
        // Apply motion
        p.y += p.speedY;
        p.x += p.speedX;
        p.rotation += p.rotationSpeed;

        // Slow fade when reaching the bottom half of the screen
        if (p.y > canvas.height * 0.7) {
          p.opacity -= 0.02;
        }

        if (p.opacity > 0 && p.y < canvas.height && p.x > -20 && p.x < canvas.width + 20) {
          alive = true;
          
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.globalAlpha = p.opacity;
          ctx.fillStyle = p.color;

          // Random shape: square or circle
          if (Math.random() > 0.5) {
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
          } else {
            ctx.beginPath();
            ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();
        }
      });

      if (alive) {
        animationFrameId = requestAnimationFrame(updateAndRender);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    updateAndRender();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [trigger]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 99999,
      }}
    />
  );
}
