import { useEffect, useRef, useState } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  color: string;
  parallaxFactor: number;
}

interface MousePosition {
  x: number;
  y: number;
}

export default function Particles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number>();
  const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      const { innerWidth, innerHeight } = window;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = innerWidth * dpr;
      canvas.height = innerHeight * dpr;
      canvas.style.width = `${innerWidth}px`;
      canvas.style.height = `${innerHeight}px`;
      ctx.scale(dpr, dpr);
    };

    const getRandomColor = () => {
      const colors = [
        'rgba(255, 255, 255, opacity)',
        'rgba(249, 115, 22, opacity)', // accent-color
        'rgba(59, 130, 246, opacity)', // blue-accent
        'rgba(236, 72, 153, opacity)', // pink accent
      ];
      return colors[Math.floor(Math.random() * colors.length)];
    };

    const createParticles = () => {
      particlesRef.current = Array.from({ length: 150 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 0.5,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.4 + 0.2,
        color: getRandomColor(),
        parallaxFactor: Math.random() * 0.8 + 0.2,
      }));
    };

    const drawConnection = (p1: Particle, p2: Particle) => {
      const dx = p1.x - p2.x;
      const dy = p1.y - p2.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 150) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(255, 255, 255, ${0.08 * (1 - distance / 150)})`;
        ctx.lineWidth = 0.5;
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }
    };

    const animate = () => {
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Calculate center of screen for parallax effect
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const mouseX = mousePosition.x - centerX;
      const mouseY = mousePosition.y - centerY;

      particlesRef.current.forEach((particle, i) => {
        // Apply parallax effect
        const parallaxX = (mouseX * particle.parallaxFactor) * 0.01;
        const parallaxY = (mouseY * particle.parallaxFactor) * 0.01;
        
        particle.x += particle.speedX + parallaxX;
        particle.y += particle.speedY + parallaxY;

        // Wrap particles around screen
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.y > canvas.height) particle.y = 0;
        if (particle.y < 0) particle.y = canvas.height;

        // Draw connections
        for (let j = i + 1; j < particlesRef.current.length; j++) {
          drawConnection(particle, particlesRef.current[j]);
        }

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color.replace('opacity', particle.opacity.toString());
        ctx.fill();

        // Add glow effect
        ctx.shadowBlur = 15;
        ctx.shadowColor = particle.color.replace('opacity', '0.5');
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
    };

    resizeCanvas();
    createParticles();
    animate();

    window.addEventListener('resize', () => {
      resizeCanvas();
      createParticles();
    });
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [mousePosition]);

  return (
    <canvas
      ref={canvasRef}
      className="particles-canvas"
      aria-hidden="true"
    />
  );
} 