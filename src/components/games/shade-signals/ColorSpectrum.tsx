"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ColorWithPosition, HSVColor } from "@/lib/games/shade-signals/types";
import { hsvToRgb, rgbToHex, positionToHSV, hsvToPosition } from "@/lib/games/shade-signals/colorUtils";
import { Lightbulb, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  const containerRef = useRef<HTMLDivElement>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 600, height: 600 });
  const [brightness, setBrightness] = useState(0.8);
  const [hoverColor, setHoverColor] = useState<ColorWithPosition | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [previewColor, setPreviewColor] = useState<ColorWithPosition | null>(null);
  const [pendingColor, setPendingColor] = useState<ColorWithPosition | null>(null);
  const [dragPreviewPosition, setDragPreviewPosition] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const updateSize = () => {
      const size = Math.min(window.innerWidth - 40, 600);
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
        const v = brightness;

        const rgb = hsvToRgb(h, s, v);
        const hex = rgbToHex(rgb.r, rgb.g, rgb.b);

        const x = centerX + r * Math.cos((angle * Math.PI) / 180);
        const y = centerY + r * Math.sin((angle * Math.PI) / 180);

        ctx.fillStyle = hex;
        ctx.fillRect(x - 1, y - 1, 3, 3);
      }
    }
  }, [canvasSize, brightness]);

  const getColorFromPosition = (x: number, y: number): ColorWithPosition => {
    const hsv = positionToHSV(x, y, canvasSize.width, canvasSize.height);
    hsv.v = brightness;
    const rgb = hsvToRgb(hsv.h, hsv.s, hsv.v);
    const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
    return { hsv, rgb, hex, x, y };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (disabled) return;
    setIsDragging(true);
    handleMouseMove(e);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const color = getColorFromPosition(x, y);
    
    if (!disabled) {
      setHoverColor(color);
      if (isDragging) {
        setPreviewColor(color);
      }
    }
  };

  const handleMouseUp = () => {
    if (disabled || !isDragging) return;
    
    setIsDragging(false);
    if (previewColor) {
      setPendingColor(previewColor);
      setPreviewColor(null);
    }
  };

  const handleMouseLeave = () => {
    setHoverColor(null);
    if (isDragging) {
      setIsDragging(false);
      setDragPreviewPosition(null);
      if (previewColor) {
        setPendingColor(previewColor);
        setPreviewColor(null);
      }
    }
  };

  const handleConfirmPick = () => {
    if (pendingColor) {
      onColorSelect(pendingColor);
      setPendingColor(null);
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (disabled || isDragging || pendingColor) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const color = getColorFromPosition(x, y);
    setPendingColor(color);
  };

  const getTouchPosition = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0] || e.changedTouches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    return { x, y, clientY: touch.clientY };
  }, []);

  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (disabled || pendingColor) return;
    e.preventDefault();
    
    const pos = getTouchPosition(e);
    if (!pos) return;

    setIsDragging(true);
    const color = getColorFromPosition(pos.x, pos.y);
    setPreviewColor(color);
    setDragPreviewPosition({ x: pos.x, y: pos.y });
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (disabled || !isDragging) return;
    e.preventDefault();
    
    const pos = getTouchPosition(e);
    if (!pos) return;

    const color = getColorFromPosition(pos.x, pos.y);
    setPreviewColor(color);
    setDragPreviewPosition({ x: pos.x, y: pos.y });
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (disabled || !isDragging) return;
    e.preventDefault();
    
    setIsDragging(false);
    setDragPreviewPosition(null);
    if (previewColor) {
      setPendingColor(previewColor);
      setPreviewColor(null);
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center gap-6">
      <div className="flex items-center gap-4 bg-[#16162a] border border-white/10 rounded-2xl px-6 py-3">
        <Lightbulb className="w-5 h-5 text-[#39ff14]" />
        <span className="text-white/70 font-semibold min-w-[80px]">Brightness:</span>
        <input
          type="range"
          min="0.3"
          max="1"
          step="0.05"
          value={brightness}
          onChange={(e) => setBrightness(parseFloat(e.target.value))}
          className="w-48 h-2 bg-white/10 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#39ff14] [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#39ff14] [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer"
        />
        <span className="text-white font-mono text-sm">{Math.round(brightness * 100)}%</span>
      </div>

      <div className="relative">
        <canvas
          ref={canvasRef}
          width={canvasSize.width}
          height={canvasSize.height}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onClick={handleClick}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className={`rounded-full ${disabled ? "cursor-not-allowed opacity-50" : "cursor-crosshair"} shadow-2xl border-4 border-white/10 touch-none`}
          style={{
            filter: "drop-shadow(0 0 40px rgba(0, 245, 255, 0.3))",
          }}
        />

        {isDragging && previewColor && dragPreviewPosition && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute pointer-events-none z-20 flex flex-col items-center"
            style={{
              left: dragPreviewPosition.x,
              top: dragPreviewPosition.y - 100,
              transform: 'translateX(-50%)',
            }}
          >
            <div
              className="w-16 h-16 rounded-xl border-4 border-white shadow-2xl"
              style={{
                backgroundColor: previewColor.hex,
                boxShadow: `0 0 30px ${previewColor.hex}, 0 0 60px ${previewColor.hex}50`,
              }}
            />
            <div className="mt-2 bg-black/80 px-3 py-1 rounded-lg">
              <span className="text-white font-mono text-sm">{previewColor.hex.toUpperCase()}</span>
            </div>
            <div
              className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent"
              style={{ borderTopColor: 'rgba(0,0,0,0.8)' }}
            />
          </motion.div>
        )}

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

        {(previewColor && isDragging) || pendingColor ? (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute w-10 h-10 rounded-full border-4 border-[#00f5ff] pointer-events-none"
            style={{
              left: (pendingColor?.x || previewColor?.x || 0) - 20,
              top: (pendingColor?.y || previewColor?.y || 0) - 20,
              backgroundColor: pendingColor?.hex || previewColor?.hex,
              boxShadow: `0 0 30px ${pendingColor?.hex || previewColor?.hex}, 0 0 40px #00f5ff`,
            }}
          />
        ) : null}
      </div>

      <AnimatePresence>
        {hoverColor && !disabled && !pendingColor && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-4 bg-[#16162a] border-2 border-white/20 rounded-2xl px-6 py-4 shadow-xl"
            style={{
              boxShadow: `0 0 30px ${hoverColor.hex}40`,
            }}
          >
            <div 
              className="w-16 h-16 rounded-lg border-2 border-white/30"
              style={{ 
                backgroundColor: hoverColor.hex,
                boxShadow: `0 0 20px ${hoverColor.hex}`
              }}
            />
            <div className="text-white">
              <div className="font-bold text-lg">{isDragging ? "Preview" : "Hover"}</div>
              <div className="font-mono text-sm text-white/70">{hoverColor.hex.toUpperCase()}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {pendingColor && !disabled && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="flex flex-col items-center gap-4 bg-gradient-to-br from-[#00f5ff]/20 to-[#1a0f2e] border-2 border-[#00f5ff] rounded-3xl p-6 shadow-2xl"
            style={{
              boxShadow: `0 0 60px ${pendingColor.hex}80, 0 0 40px rgba(0, 245, 255, 0.4)`,
            }}
          >
            <div className="flex items-center gap-4">
              <div 
                className="w-20 h-20 rounded-xl border-4 border-white/40"
                style={{ 
                  backgroundColor: pendingColor.hex,
                  boxShadow: `0 0 30px ${pendingColor.hex}`
                }}
              />
              <div className="text-white">
                <div className="font-bold text-xl">Selected Color</div>
                <div className="font-mono text-lg text-[#00f5ff]">{pendingColor.hex.toUpperCase()}</div>
              </div>
            </div>
            <Button
              onClick={handleConfirmPick}
              className="w-full bg-gradient-to-r from-[#00f5ff] to-[#39ff14] hover:opacity-90 text-black font-bold py-4 text-lg"
            >
              <Check className="w-5 h-5 mr-2" />
              Confirm Pick
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}