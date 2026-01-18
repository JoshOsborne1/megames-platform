"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ColorWithPosition } from "@/lib/games/shade-signals/types";
import { hsvToRgb, rgbToHex, positionToHSV, hsvToPosition } from "@/lib/games/shade-signals/colorUtils";
import { Lightbulb, Check, ZoomIn, X } from "lucide-react";

interface ColorSpectrumProps {
  onColorSelect: (color: ColorWithPosition) => void;
  markers?: ColorWithPosition[];
  targetColor?: ColorWithPosition;
  showTarget?: boolean;
  showMarkers?: boolean;
  disabled?: boolean;
}

export function ColorSpectrum({
  onColorSelect,
  markers = [],
  targetColor,
  showTarget = false,
  showMarkers = true,
  disabled = false
}: ColorSpectrumProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const zoomCanvasRef = useRef<HTMLCanvasElement>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 350, height: 350 });
  const [brightness, setBrightness] = useState(0.8);
  const [hoverColor, setHoverColor] = useState<ColorWithPosition | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [pendingColor, setPendingColor] = useState<ColorWithPosition | null>(null);
  const [showZoom, setShowZoom] = useState(false);
  const [zoomBrightness, setZoomBrightness] = useState(0.8);
  const ZOOM_SIZE = 260;

  useEffect(() => {
    const updateSize = () => {
      const size = Math.min(window.innerWidth - 48, 350);
      setCanvasSize({ width: size, height: size });
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const getColorFromPosition = useCallback((x: number, y: number, size = canvasSize): ColorWithPosition | null => {
    const centerX = size.width / 2;
    const centerY = size.height / 2;
    const maxRadius = Math.min(centerX, centerY) * 0.9;

    const dx = x - centerX;
    const dy = y - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > maxRadius) return null;

    const hsv = positionToHSV(x, y, size.width, size.height);
    hsv.v = brightness;
    const rgb = hsvToRgb(hsv.h, hsv.s, hsv.v);
    const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
    return { hsv, rgb, hex, x, y };
  }, [brightness, canvasSize]);

  const getConstrainedColor = useCallback((x: number, y: number, size = canvasSize): ColorWithPosition => {
    const centerX = size.width / 2;
    const centerY = size.height / 2;
    const maxRadius = Math.min(centerX, centerY) * 0.9;

    const dx = x - centerX;
    const dy = y - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    let constrainedX = x;
    let constrainedY = y;

    if (distance > maxRadius) {
      const angle = Math.atan2(dy, dx);
      constrainedX = centerX + maxRadius * Math.cos(angle);
      constrainedY = centerY + maxRadius * Math.sin(angle);
    }

    const hsv = positionToHSV(constrainedX, constrainedY, size.width, size.height);
    hsv.v = brightness;
    const rgb = hsvToRgb(hsv.h, hsv.s, hsv.v);
    const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
    return { hsv, rgb, hex, x: constrainedX, y: constrainedY };
  }, [brightness, canvasSize]);

  useEffect(() => {
    if (pendingColor && !showZoom) {
      const updated = getConstrainedColor(pendingColor.x, pendingColor.y);
      setPendingColor(updated);
    }
  }, [brightness]);

  useEffect(() => {
    setPendingColor(null);
    setHoverColor(null);
  }, [disabled]);

  // Global touch/mouse move handlers for smooth dragging
  useEffect(() => {
    if (!isDragging) return;

    const handleGlobalMove = (e: TouchEvent | MouseEvent) => {
      e.preventDefault();
      const canvas = canvasRef.current;
      if (!canvas || disabled) return;

      let clientX: number, clientY: number;
      if ('touches' in e) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }

      const rect = canvas.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      const color = getConstrainedColor(x, y);
      setPendingColor(color);
    };

    const handleGlobalEnd = (e: TouchEvent | MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) {
        setIsDragging(false);
        return;
      }

      let clientX: number, clientY: number;
      if ('changedTouches' in e) {
        const touchEvent = e as TouchEvent;
        clientX = touchEvent.changedTouches[0].clientX;
        clientY = touchEvent.changedTouches[0].clientY;
      } else {
        const mouseEvent = e as MouseEvent;
        clientX = mouseEvent.clientX;
        clientY = mouseEvent.clientY;
      }

      const rect = canvas.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      const color = getConstrainedColor(x, y);
      setPendingColor(color);
      setIsDragging(false);
    };

    // Add global listeners with passive: false for proper preventDefault
    document.addEventListener('touchmove', handleGlobalMove, { passive: false });
    document.addEventListener('touchend', handleGlobalEnd, { passive: false });
    document.addEventListener('mousemove', handleGlobalMove);
    document.addEventListener('mouseup', handleGlobalEnd);

    return () => {
      document.removeEventListener('touchmove', handleGlobalMove);
      document.removeEventListener('touchend', handleGlobalEnd);
      document.removeEventListener('mousemove', handleGlobalMove);
      document.removeEventListener('mouseup', handleGlobalEnd);
    };
  }, [isDragging, disabled, getConstrainedColor]);

  // Draw main canvas
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

  // Draw zoom canvas - A mini wheel centered on the selected color's hue/saturation
  useEffect(() => {
    if (!showZoom || !pendingColor) return;
    const canvas = zoomCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const centerX = ZOOM_SIZE / 2;
    const centerY = ZOOM_SIZE / 2;
    const maxRadius = ZOOM_SIZE / 2 - 10;

    // The zoom shows a ±15 degree hue range and ±0.15 saturation range around the current selection
    const baseHue = pendingColor.hsv.h;
    const baseSat = pendingColor.hsv.s;
    const hueRange = 30; // ±15 degrees
    const satRange = 0.3; // ±0.15

    ctx.clearRect(0, 0, ZOOM_SIZE, ZOOM_SIZE);

    // Draw the mini wheel
    for (let px = 0; px < ZOOM_SIZE; px++) {
      for (let py = 0; py < ZOOM_SIZE; py++) {
        const dx = px - centerX;
        const dy = py - centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance <= maxRadius) {
          // Map position to hue/saturation offsets
          const hueOffset = (dx / maxRadius) * (hueRange / 2);
          const satOffset = -(dy / maxRadius) * (satRange / 2);

          let h = baseHue + hueOffset;
          if (h < 0) h += 360;
          if (h >= 360) h -= 360;

          let s = Math.max(0, Math.min(1, baseSat + satOffset));

          const rgb = hsvToRgb(h, s, zoomBrightness);
          ctx.fillStyle = rgbToHex(rgb.r, rgb.g, rgb.b);
          ctx.fillRect(px, py, 1, 1);
        }
      }
    }

    // Draw crosshair at center (current selection)
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 8, 0, Math.PI * 2);
    ctx.stroke();
  }, [showZoom, pendingColor, zoomBrightness]);

  // Open zoom with current brightness
  const openZoom = () => {
    if (pendingColor) {
      setZoomBrightness(pendingColor.hsv.v);
      setShowZoom(true);
    }
  };

  // Handle zoom canvas click - maps position to hue/saturation adjustments
  const handleZoomClick = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!pendingColor) return;

    const canvas = zoomCanvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    let clientX: number, clientY: number;

    if ('touches' in e) {
      clientX = e.touches[0]?.clientX || e.changedTouches[0]?.clientX;
      clientY = e.touches[0]?.clientY || e.changedTouches[0]?.clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    const centerX = ZOOM_SIZE / 2;
    const centerY = ZOOM_SIZE / 2;
    const maxRadius = ZOOM_SIZE / 2 - 10;

    const dx = x - centerX;
    const dy = y - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance <= maxRadius) {
      const hueRange = 30;
      const satRange = 0.3;

      const hueOffset = (dx / maxRadius) * (hueRange / 2);
      const satOffset = -(dy / maxRadius) * (satRange / 2);

      let newH = pendingColor.hsv.h + hueOffset;
      if (newH < 0) newH += 360;
      if (newH >= 360) newH -= 360;

      let newS = Math.max(0, Math.min(1, pendingColor.hsv.s + satOffset));

      const newHsv = { h: newH, s: newS, v: zoomBrightness };
      const rgb = hsvToRgb(newH, newS, zoomBrightness);
      const hex = rgbToHex(rgb.r, rgb.g, rgb.b);

      // Calculate new position on main canvas
      const mainPos = hsvToPosition(newHsv, canvasSize.width, canvasSize.height);

      setPendingColor({
        hsv: newHsv,
        rgb,
        hex,
        x: mainPos.x,
        y: mainPos.y
      });
    }
  };

  const handleInteraction = (clientX: number, clientY: number, isEnd = false) => {
    const canvas = canvasRef.current;
    if (!canvas || disabled) return;

    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    const color = getConstrainedColor(x, y);

    if (isEnd) {
      setPendingColor(color);
      setIsDragging(false);
    } else {
      setHoverColor(color);
      if (isDragging) {
        setPendingColor(color);
      }
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (disabled) return;
    setIsDragging(true);
    handleInteraction(e.clientX, e.clientY);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    handleInteraction(e.clientX, e.clientY);
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDragging) handleInteraction(e.clientX, e.clientY, true);
  };

  const handleMouseLeave = () => {
    setHoverColor(null);
    if (isDragging) setIsDragging(false);
  };

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (disabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const color = getColorFromPosition(e.clientX - rect.left, e.clientY - rect.top);
    if (color) setPendingColor(color);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (disabled) return;
    e.preventDefault();
    setIsDragging(true);
    handleInteraction(e.touches[0].clientX, e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (disabled || !isDragging) return;
    e.preventDefault();
    handleInteraction(e.touches[0].clientX, e.touches[0].clientY);
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (disabled) return;
    e.preventDefault();
    handleInteraction(e.changedTouches[0].clientX, e.changedTouches[0].clientY, true);
  };

  const handleConfirmPick = () => {
    if (pendingColor) {
      onColorSelect(pendingColor);
      setPendingColor(null);
      setShowZoom(false);
    }
  };

  return (
    <div className="relative flex flex-col items-center gap-4">
      {/* Selection Bar */}
      <div className="w-full p-4 rounded-xl bg-white/5 border border-white/10 flex items-center gap-4">
        <div
          className="w-14 h-14 rounded-xl border-2 border-white/20 flex-shrink-0"
          style={{ backgroundColor: pendingColor?.hex || hoverColor?.hex || "#111" }}
        />
        <div className="flex-1 min-w-0">
          <p className="text-white/40 text-xs uppercase tracking-wider">Selected</p>
          <p className="font-mono text-white font-bold truncate">
            {(pendingColor?.hex || hoverColor?.hex || "------").toUpperCase()}
          </p>
        </div>
        {pendingColor && (
          <div className="flex gap-2">
            <button
              onClick={openZoom}
              className="px-3 py-2 rounded-lg bg-white/10 text-white/60 hover:bg-white/20 transition-colors"
              title="Fine-tune"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={handleConfirmPick}
              className="px-4 py-2 rounded-lg bg-emerald-500 text-white font-bold flex items-center gap-2"
            >
              <Check className="w-4 h-4" /> Confirm
            </button>
          </div>
        )}
      </div>

      {/* Brightness Slider */}
      <div className="w-full flex items-center gap-3 px-2">
        <Lightbulb className="w-4 h-4 text-white/40" />
        <input
          type="range"
          min="0.3"
          max="1"
          step="0.05"
          value={brightness}
          onChange={(e) => setBrightness(parseFloat(e.target.value))}
          className="flex-1 h-2 bg-white/10 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
        />
        <span className="text-white/40 text-xs w-10 text-right">{Math.round(brightness * 100)}%</span>
      </div>

      {/* Color Wheel */}
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
          className={`rounded-full ${disabled ? "cursor-not-allowed opacity-50" : "cursor-crosshair"} border-4 border-white/10 touch-none`}
        />

        {/* Markers */}
        {showMarkers && markers.map((marker, index) => {
          const pos = hsvToPosition(marker.hsv, canvasSize.width, canvasSize.height);
          return (
            <motion.div
              key={index}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute w-6 h-6 rounded-full border-2 border-white pointer-events-none flex items-center justify-center text-[10px] font-bold text-white"
              style={{ left: pos.x - 12, top: pos.y - 12, backgroundColor: marker.hex }}
            >
              {index + 1}
            </motion.div>
          );
        })}

        {/* Target marker */}
        {showTarget && targetColor && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute w-10 h-10 rounded-full border-4 border-white pointer-events-none flex items-center justify-center"
            style={{
              left: hsvToPosition(targetColor.hsv, canvasSize.width, canvasSize.height).x - 20,
              top: hsvToPosition(targetColor.hsv, canvasSize.width, canvasSize.height).y - 20,
              backgroundColor: targetColor.hex,
            }}
          >
            <span className="text-white text-lg">★</span>
          </motion.div>
        )}

        {/* Pending selection */}
        {pendingColor && (
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="absolute w-8 h-8 rounded-full border-4 border-[#00FFFF] pointer-events-none"
            style={{ left: pendingColor.x - 16, top: pendingColor.y - 16, backgroundColor: pendingColor.hex }}
          />
        )}
      </div>

      {/* ZOOM MODAL - Mini color wheel for fine-tuning */}
      <AnimatePresence>
        {showZoom && pendingColor && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowZoom(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[300px]"
            >
              <div className="bg-[#0a0015] border border-white/10 rounded-2xl p-4 shadow-2xl">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-display font-bold text-white text-sm">Fine-tune Color</h3>
                  <button onClick={() => setShowZoom(false)} className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/50">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-white/40 text-xs text-center mb-3">Tap to adjust hue & saturation</p>

                {/* Mini Color Wheel */}
                <div className="flex justify-center mb-3">
                  <canvas
                    ref={zoomCanvasRef}
                    width={ZOOM_SIZE}
                    height={ZOOM_SIZE}
                    onClick={handleZoomClick}
                    onTouchEnd={handleZoomClick}
                    className="rounded-full border-2 border-white/20 cursor-crosshair touch-none"
                  />
                </div>

                {/* Brightness for zoom */}
                <div className="flex items-center gap-2 mb-3 px-2">
                  <Lightbulb className="w-3 h-3 text-white/40" />
                  <input
                    type="range"
                    min="0.3"
                    max="1"
                    step="0.05"
                    value={zoomBrightness}
                    onChange={(e) => {
                      const newV = parseFloat(e.target.value);
                      setZoomBrightness(newV);
                      if (pendingColor) {
                        const newHsv = { ...pendingColor.hsv, v: newV };
                        const rgb = hsvToRgb(newHsv.h, newHsv.s, newV);
                        const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
                        setPendingColor({ ...pendingColor, hsv: newHsv, rgb, hex });
                      }
                    }}
                    className="flex-1 h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
                  />
                  <span className="text-white/40 text-xs w-8">{Math.round(zoomBrightness * 100)}%</span>
                </div>

                {/* Current color */}
                <div className="flex items-center gap-3 mb-3 p-3 rounded-lg bg-white/5">
                  <div className="w-10 h-10 rounded-lg border-2 border-white/30" style={{ backgroundColor: pendingColor.hex }} />
                  <span className="font-mono text-white font-bold">{pendingColor.hex.toUpperCase()}</span>
                </div>

                <button
                  onClick={handleConfirmPick}
                  className="w-full py-3 rounded-xl bg-emerald-500 text-white font-bold flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" /> Confirm
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
