'use client';

import { useEffect, useRef, useCallback } from 'react';

interface Ripple {
  x: number;
  y: number;
  size: number;
  color: string;
  progress: number;
  velocity: number;
}

interface TrailDot {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  size: number;
  opacity: number;
}

export default function WaterRippleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ripplesRef = useRef<Ripple[]>([]);
  const trailDotsRef = useRef<TrailDot[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const animationRef = useRef<number>();

  const getThemeColors = useCallback(() => {
    const isDark = document.documentElement.classList.contains('dark');
    return {
      ripple: isDark ? 'rgba(59, 130, 246, 0.4)' : 'rgba(59, 130, 246, 0.3)',
      trail: isDark ? 'rgba(96, 165, 250, 0.6)' : 'rgba(59, 130, 246, 0.5)',
      bg: isDark ? '#0f172a' : '#f8fafc',
      bgGradient: isDark 
        ? 'radial-gradient(ellipse at 20% 20%, rgba(59, 130, 246, 0.15) 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(147, 51, 234, 0.1) 0%, transparent 50%), #0f172a'
        : 'radial-gradient(ellipse at 20% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(147, 51, 234, 0.08) 0%, transparent 50%), #f8fafc'
    };
  }, []);

  const createRipple = useCallback((x: number, y: number, isClick: boolean = false) => {
    const colors = getThemeColors();
    const size = isClick ? Math.random() * 80 + 60 : Math.random() * 40 + 30;
    
    ripplesRef.current.push({
      x,
      y,
      size,
      color: colors.ripple,
      progress: 0,
      velocity: isClick ? 0.015 : 0.008
    });
  }, [getThemeColors]);

  const updateRipples = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ripplesRef.current = ripplesRef.current.filter(ripple => {
      ripple.progress += ripple.velocity;
      
      if (ripple.progress >= 1) return false;

      const currentSize = ripple.size * (0.2 + ripple.progress * 0.8);
      const opacity = (1 - ripple.progress) * 0.5;

      ctx.beginPath();
      ctx.arc(ripple.x, ripple.y, currentSize, 0, Math.PI * 2);
      ctx.strokeStyle = ripple.color.replace(/[\d.]+\)$/, `${opacity})`);
      ctx.lineWidth = 2 * (1 - ripple.progress);
      ctx.stroke();

      // Inner ripple
      if (ripple.progress < 0.7) {
        const innerSize = currentSize * 0.6;
        const innerOpacity = (1 - ripple.progress / 0.7) * 0.3;
        ctx.beginPath();
        ctx.arc(ripple.x, ripple.y, innerSize, 0, Math.PI * 2);
        ctx.strokeStyle = ripple.color.replace(/[\d.]+\)$/, `${innerOpacity})`);
        ctx.lineWidth = 1.5 * (1 - ripple.progress);
        ctx.stroke();
      }

      return true;
    });
  }, []);

  const updateTrailDots = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const colors = getThemeColors();

    // Add new dots based on mouse movement
    if (mouseRef.current.x > 0 && mouseRef.current.y > 0) {
      if (Math.random() > 0.7) {
        trailDotsRef.current.push({
          x: mouseRef.current.x + (Math.random() - 0.5) * 20,
          y: mouseRef.current.y + (Math.random() - 0.5) * 20,
          targetX: mouseRef.current.x,
          targetY: mouseRef.current.y,
          size: Math.random() * 3 + 2,
          opacity: Math.random() * 0.5 + 0.3
        });
      }
    }

    // Update and draw trail dots
    trailDotsRef.current = trailDotsRef.current.filter(dot => {
      dot.x += (dot.targetX - dot.x) * 0.1;
      dot.y += (dot.targetY - dot.y) * 0.1;
      dot.opacity -= 0.015;
      dot.size *= 0.98;

      if (dot.opacity <= 0 || dot.size < 0.5) return false;

      ctx.beginPath();
      ctx.arc(dot.x, dot.y, dot.size, 0, Math.PI * 2);
      ctx.fillStyle = colors.trail.replace(/[\d.]+\)$/, `${dot.opacity})`);
      ctx.fill();

      // Glow effect
      ctx.beginPath();
      ctx.arc(dot.x, dot.y, dot.size * 2, 0, Math.PI * 2);
      ctx.fillStyle = colors.trail.replace(/[\d.]+\)$/, `${dot.opacity * 0.3})`);
      ctx.fill();

      return true;
    });

    // Limit trail dots count
    if (trailDotsRef.current.length > 100) {
      trailDotsRef.current = trailDotsRef.current.slice(-100);
    }
  }, [getThemeColors]);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw subtle ambient particles
    const colors = getThemeColors();
    const time = Date.now() * 0.0001;
    
    for (let i = 0; i < 20; i++) {
      const x = (Math.sin(time + i * 0.5) * 0.5 + 0.5) * canvas.width;
      const y = (Math.cos(time * 0.7 + i * 0.3) * 0.5 + 0.5) * canvas.height;
      const size = Math.sin(time + i) * 1 + 2;
      const opacity = Math.sin(time * 2 + i * 0.5) * 0.1 + 0.1;

      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fillStyle = colors.ripple.replace(/[\d.]+\)$/, `${opacity})`);
      ctx.fill();
    }

    updateRipples();
    updateTrailDots();

    animationRef.current = requestAnimationFrame(animate);
  }, [getThemeColors, updateRipples, updateTrailDots]);

  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    mouseRef.current = { x: e.clientX, y: e.clientY };
    
    // Create ripples on mouse movement
    if (Math.random() > 0.85) {
      createRipple(e.clientX, e.clientY);
    }
  }, [createRipple]);

  const handleClick = useCallback((e: MouseEvent) => {
    createRipple(e.clientX, e.clientY, true);
    createRipple(e.clientX, e.clientY, true);
  }, [createRipple]);

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [handleResize, handleMouseMove, handleClick, animate]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}
