"use client";

import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { ColorWithPosition, HSVColor } from "@/lib/games/shade-signals/types";
import { hsvToRgb, rgbToHex, positionToHSV, hsvToPosition } from "@/lib/games/shade-signals/colorUtils";

interface ColorSpectrumProps {
  onColorSelect: (color: ColorWithPosition) => void;
  markers: ColorWithPosition[];
  targetColor?: ColorWithPosition;
  showTarget?: boolean;
  disabled?: boolean;
}

export function ColorSpectrum({
  onColorSelect,
  markers,
  targetColor,
  showTarget = false,
  disabled = false
}: ColorSpectrumProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 600, height: 600 });

  useEffect(() => {
    const updateSize = () => {
      const size = Math.min(window.innerWidth - 100, 600);
      setCanvasSize({ width: size, height: size });
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { width, height } = canvasSize;
    const centerX = width / 2;
    const centerY = height / 2;
    const maxRadius = Math.min(centerX, centerY) * 0.9;

    ctx.clearRect(0, 0, width, height);

    for (let angle = 0; angle < 360; angle += 1) {
      for (let r = 0; r < maxRadius; r += 2) {
        const h = angle;
        const s = r / maxRadius;
        const v = 0.8;

        const rgb = hsvToRgb(h, s, v);
        const hex = rgbToHex(rgb.r, rgb.g, rgb.b);

        const x = centerX + r * Math.cos((angle * Math.PI) / 180);
        const y = centerY + r * Math.sin((angle * Math.PI) / 180);

        ctx.fillStyle = hex;
        ctx.fillRect(x - 1, y - 1, 3, 3);
      }
    }
  }, [canvasSize]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (disabled) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const hsv = positionToHSV(x, y, canvasSize.width, canvasSize.height);
    const rgb = hsvToRgb(hsv.h, hsv.s, hsv.v);
    const hex = rgbToHex(rgb.r, rgb.g, rgb.b);

    onColorSelect({ hsv, rgb, hex, x, y });
  };

  return (
    <div className="relative flex items-center justify-center">
      <canvas
        ref={canvasRef}
        width={canvasSize.width}
        height={canvasSize.height}
        onClick={handleCanvasClick}
        className={`rounded-full ${disabled ? "cursor-not-allowed opacity-50" : "cursor-crosshair"} shadow-2xl border-4 border-white/10`}
        style={{
          filter: "drop-shadow(0 0 40px rgba(0, 245, 255, 0.3))",
        }}
      />

      {markers.map((marker, index) => {
        const pos = hsvToPosition(marker.hsv, canvasSize.width, canvasSize.height);
        return (
          <motion.div
            key={index}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            className="absolute w-8 h-8 rounded-full border-4 border-white shadow-lg pointer-events-none"
            style={{
              left: pos.x - 16,
              top: pos.y - 16,
              backgroundColor: marker.hex,
              boxShadow: `0 0 20px ${marker.hex}`,
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-sm drop-shadow-lg">
              {index + 1}
            </div>
          </motion.div>
        );
      })}

      {showTarget && targetColor && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [1, 1.2, 1], opacity: 1 }}
          transition={{ duration: 0.8, times: [0, 0.5, 1] }}
          className="absolute w-12 h-12 rounded-full border-8 border-[#39ff14] pointer-events-none"
          style={{
            left: hsvToPosition(targetColor.hsv, canvasSize.width, canvasSize.height).x - 24,
            top: hsvToPosition(targetColor.hsv, canvasSize.width, canvasSize.height).y - 24,
            backgroundColor: targetColor.hex,
            boxShadow: `0 0 40px ${targetColor.hex}, 0 0 60px #39ff14`,
          }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 flex items-center justify-center text-white font-black text-lg drop-shadow-2xl"
          >
            ★
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
