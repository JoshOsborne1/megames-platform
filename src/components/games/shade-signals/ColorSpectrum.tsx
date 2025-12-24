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
  const [canvasSize, setCanvasSize] = useState({ width: 500, height: 500 });
  const [brightness, setBrightness] = useState(0.8);
  const [hoverColor, setHoverColor] = useState<ColorWithPosition | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [previewColor, setPreviewColor] = useState<ColorWithPosition | null>(null);
  const [pendingColor, setPendingColor] = useState<ColorWithPosition | null>(null);
  const [dragPreviewPosition, setDragPreviewPosition] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const updateSize = () => {
      const size = Math.min(window.innerWidth - 40, 500);
      setCanvasSize({ width: size, height: size });
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const getColorFromPosition = (x: number, y: number): ColorWithPosition | null => {
    const centerX = canvasSize.width / 2;
    const centerY = canvasSize.height / 2;
    const maxRadius = Math.min(centerX, centerY) * 0.9;

    // Check if position is within the wheel
    const dx = x - centerX;
    const dy = y - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > maxRadius) {
      // Position is outside the wheel - return null
      return null;
    }

    const hsv = positionToHSV(x, y, canvasSize.width, canvasSize.height);
    hsv.v = brightness;
    const rgb = hsvToRgb(hsv.h, hsv.s, hsv.v);
    const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
    return { hsv, rgb, hex, x, y };
  };

  // Version that constrains to wheel edge (for dragging)
  const getConstrainedColor = (x: number, y: number): ColorWithPosition => {
    const centerX = canvasSize.width / 2;
    const centerY = canvasSize.height / 2;
    const maxRadius = Math.min(centerX, centerY) * 0.9;

    const dx = x - centerX;
    const dy = y - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // If outside wheel, constrain to edge
    let constrainedX = x;
    let constrainedY = y;

    if (distance > maxRadius) {
      const angle = Math.atan2(dy, dx);
      constrainedX = centerX + maxRadius * Math.cos(angle);
      constrainedY = centerY + maxRadius * Math.sin(angle);
    }

    const hsv = positionToHSV(constrainedX, constrainedY, canvasSize.width, canvasSize.height);
    hsv.v = brightness;
    const rgb = hsvToRgb(hsv.h, hsv.s, hsv.v);
    const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
    return { hsv, rgb, hex, x: constrainedX, y: constrainedY };
  };

  // Sync selection with brightness
  useEffect(() => {
    if (pendingColor) {
      const updatedColor = getConstrainedColor(pendingColor.x, pendingColor.y);
      setPendingColor(updatedColor);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [brightness, canvasSize]);

  useEffect(() => {
    setPendingColor(null);
    setHoverColor(null);
    setPreviewColor(null);
  }, [disabled]);

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

    if (!disabled) {
      if (isDragging) {
        // While dragging, constrain to wheel edge
        const color = getConstrainedColor(x, y);
        setPreviewColor(color);
        setHoverColor(color);
        setDragPreviewPosition({ x: color.x, y: color.y });
      } else {
        // Just hovering - only show if within wheel
        const color = getColorFromPosition(x, y);
        setHoverColor(color);
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
      // Only set pending color if we have a valid preview color
      // that is within the wheel bounds
      if (previewColor) {
        // Verify previewColor is within bounds before setting
        const centerX = canvasSize.width / 2;
        const centerY = canvasSize.height / 2;
        const maxRadius = Math.min(centerX, centerY) * 0.9;
        const dx = previewColor.x - centerX;
        const dy = previewColor.y - centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance <= maxRadius) {
          setPendingColor(previewColor);
        }
        // If outside bounds, discard the preview - don't set pending
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
    if (disabled || isDragging) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Only allow clicks within the wheel
    const color = getColorFromPosition(x, y);
    if (color) {
      setPendingColor(color);
    }
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
    if (disabled) return;
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

    // Constrain touch position to wheel bounds
    const color = getConstrainedColor(pos.x, pos.y);
    setPreviewColor(color);
    setDragPreviewPosition({ x: color.x, y: color.y });
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (disabled || !isDragging) return;
    e.preventDefault();

    setIsDragging(false);
    setDragPreviewPosition(null);
    if (previewColor) {
      // Only set pending if within bounds (which it should be since we constrain during drag)
      setPendingColor(previewColor);
      setPreviewColor(null);
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center gap-8">
      {/* Selection Preview & Brightness Controls at the top together */}
      <div className="flex flex-col md:flex-row items-center gap-6 bg-[#16162a]/80 backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 shadow-2xl w-full max-w-2xl">
        {/* Current Selection */}
        <div className="flex items-center gap-4 flex-1">
          <div
            className="w-20 h-20 rounded-2xl border-2 border-white/20 transition-colors duration-200"
            style={{
              backgroundColor: pendingColor?.hex || previewColor?.hex || "#111",
            }}
          />
          <div className="flex flex-col">
            <span className="text-white/50 text-xs font-bold uppercase tracking-wider">Current Selection</span>
            <span className="text-white font-mono text-2xl font-black">
              {(pendingColor?.hex || previewColor?.hex || "#------").toUpperCase()}
            </span>
            {pendingColor && (
              <Button
                onClick={handleConfirmPick}
                size="sm"
                className="mt-2 bg-[#39ff14] hover:bg-[#39ff14]/80 text-black font-black"
              >
                <Check className="w-4 h-4 mr-2" />
                CONFIRM
              </Button>
            )}
          </div>
        </div>

        <div className="h-px md:h-12 w-full md:w-px bg-white/10" />

        {/* Brightness Control */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-2 text-white/50 text-xs font-bold uppercase tracking-wider">
            <Lightbulb className="w-3 h-3 text-[#39ff14]" />
            Brightness: {Math.round(brightness * 100)}%
          </div>
          <input
            type="range"
            min="0.3"
            max="1"
            step="0.05"
            value={brightness}
            onChange={(e) => setBrightness(parseFloat(e.target.value))}
            className="w-48 h-2 bg-white/10 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#39ff14] [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#39ff14] [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer"
          />
        </div>
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
        />

        {/* Touch/Mouse dragging preview - no glow */}
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
              }}
            />
            <div className="mt-2 bg-black/80 px-3 py-1 rounded-lg">
              <span className="text-white font-mono text-sm">{previewColor.hex.toUpperCase()}</span>
            </div>
          </motion.div>
        )}

        {/* Player markers - no glow */}
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
              }}
            >
              <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-sm drop-shadow-lg">
                {index + 1}
              </div>
            </motion.div>
          );
        })}

        {/* Target marker - minimal glow for visibility but not deceiving */}
        {showTarget && targetColor && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [1, 1.2, 1], opacity: 1 }}
            transition={{ duration: 0.8, times: [0, 0.5, 1] }}
            className="absolute w-12 h-12 rounded-full border-8 border-[#39ff14] pointer-events-none flex items-center justify-center"
            style={{
              left: hsvToPosition(targetColor.hsv, canvasSize.width, canvasSize.height).x - 24,
              top: hsvToPosition(targetColor.hsv, canvasSize.width, canvasSize.height).y - 24,
              backgroundColor: targetColor.hex,
            }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="text-white font-black text-lg drop-shadow-2xl"
            >
              ★
            </motion.div>
          </motion.div>
        )}

        {/* Pending selection marker - no glow */}
        {pendingColor ? (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute w-10 h-10 rounded-full border-4 border-[#00f5ff] pointer-events-none"
            style={{
              left: pendingColor.x - 20,
              top: pendingColor.y - 20,
              backgroundColor: pendingColor.hex,
            }}
          />
        ) : null}
      </div>

      {/* Hover info - simple */}
      <AnimatePresence>
        {hoverColor && !disabled && !pendingColor && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 pointer-events-none"
          >
            <div className="flex items-center gap-3">
              <div
                className="w-6 h-6 rounded border border-white/40"
                style={{ backgroundColor: hoverColor.hex }}
              />
              <span className="text-white font-mono text-sm tracking-widest">{hoverColor.hex.toUpperCase()}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
