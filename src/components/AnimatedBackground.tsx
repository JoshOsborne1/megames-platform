"use client";

import { useEffect, useRef } from "react";

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    color: string;
    alpha: number;
}

const COLORS = ['#ff006e', '#8338ec', '#00f5ff', '#32CD32'];

export function AnimatedBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particlesRef = useRef<Particle[]>([]);
    const mouseRef = useRef({ x: 0, y: 0 });
    const animationRef = useRef<number>(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        // Initialize particles
        const particleCount = Math.min(50, Math.floor(window.innerWidth / 30));
        particlesRef.current = [];

        for (let i = 0; i < particleCount; i++) {
            particlesRef.current.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 3 + 1,
                color: COLORS[Math.floor(Math.random() * COLORS.length)],
                alpha: Math.random() * 0.3 + 0.1
            });
        }

        const handleMouseMove = (e: MouseEvent) => {
            mouseRef.current = { x: e.clientX, y: e.clientY };
        };
        window.addEventListener('mousemove', handleMouseMove);

        const handleTouchMove = (e: TouchEvent) => {
            if (e.touches[0]) {
                mouseRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
            }
        };
        window.addEventListener('touchmove', handleTouchMove);

        const animate = () => {
            if (!ctx || !canvas) return;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw gradient orbs (static background elements)
            ctx.save();

            // Purple orb top-right
            const gradient1 = ctx.createRadialGradient(
                canvas.width * 0.8, canvas.height * 0.2, 0,
                canvas.width * 0.8, canvas.height * 0.2, 300
            );
            gradient1.addColorStop(0, 'rgba(131, 56, 236, 0.15)');
            gradient1.addColorStop(1, 'transparent');
            ctx.fillStyle = gradient1;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Pink orb bottom-left
            const gradient2 = ctx.createRadialGradient(
                canvas.width * 0.1, canvas.height * 0.8, 0,
                canvas.width * 0.1, canvas.height * 0.8, 250
            );
            gradient2.addColorStop(0, 'rgba(255, 0, 110, 0.1)');
            gradient2.addColorStop(1, 'transparent');
            ctx.fillStyle = gradient2;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Cyan orb center
            const gradient3 = ctx.createRadialGradient(
                canvas.width * 0.5, canvas.height * 0.5, 0,
                canvas.width * 0.5, canvas.height * 0.5, 400
            );
            gradient3.addColorStop(0, 'rgba(0, 245, 255, 0.05)');
            gradient3.addColorStop(1, 'transparent');
            ctx.fillStyle = gradient3;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.restore();

            // Update and draw particles
            particlesRef.current.forEach((particle, i) => {
                // Mouse interaction - particles gently attracted to cursor
                const dx = mouseRef.current.x - particle.x;
                const dy = mouseRef.current.y - particle.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 200) {
                    const force = (200 - dist) / 200 * 0.01;
                    particle.vx += dx * force * 0.01;
                    particle.vy += dy * force * 0.01;
                }

                // Update position
                particle.x += particle.vx;
                particle.y += particle.vy;

                // Damping
                particle.vx *= 0.99;
                particle.vy *= 0.99;

                // Wrap around edges
                if (particle.x < 0) particle.x = canvas.width;
                if (particle.x > canvas.width) particle.x = 0;
                if (particle.y < 0) particle.y = canvas.height;
                if (particle.y > canvas.height) particle.y = 0;

                // Draw particle
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fillStyle = particle.color.replace(')', `, ${particle.alpha})`).replace('rgb', 'rgba').replace('#', '');

                // Convert hex to rgba for filling
                const hex = particle.color;
                const r = parseInt(hex.slice(1, 3), 16);
                const g = parseInt(hex.slice(3, 5), 16);
                const b = parseInt(hex.slice(5, 7), 16);
                ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${particle.alpha})`;
                ctx.fill();

                // Draw connections between nearby particles
                for (let j = i + 1; j < particlesRef.current.length; j++) {
                    const other = particlesRef.current[j];
                    const dx2 = other.x - particle.x;
                    const dy2 = other.y - particle.y;
                    const dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);

                    if (dist2 < 150) {
                        ctx.beginPath();
                        ctx.moveTo(particle.x, particle.y);
                        ctx.lineTo(other.x, other.y);
                        ctx.strokeStyle = `rgba(255, 255, 255, ${0.05 * (1 - dist2 / 150)})`;
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                }
            });

            animationRef.current = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('touchmove', handleTouchMove);
            cancelAnimationFrame(animationRef.current);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-0"
            style={{ background: 'transparent' }}
        />
    );
}
