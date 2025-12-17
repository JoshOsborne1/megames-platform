import type { HSVColor, RGBColor, ColorWithPosition } from "./types";

export function hsvToRgb(h: number, s: number, v: number): RGBColor {
  const c = v * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - c;

  let r = 0, g = 0, b = 0;

  if (h >= 0 && h < 60) {
    r = c; g = x; b = 0;
  } else if (h >= 60 && h < 120) {
    r = x; g = c; b = 0;
  } else if (h >= 120 && h < 180) {
    r = 0; g = c; b = x;
  } else if (h >= 180 && h < 240) {
    r = 0; g = x; b = c;
  } else if (h >= 240 && h < 300) {
    r = x; g = 0; b = c;
  } else {
    r = c; g = 0; b = x;
  }

  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  };
}

export function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => {
    const hex = n.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function generateVibrantColor(): ColorWithPosition {
  const h = Math.random() * 360;
  const s = 0.3 + Math.random() * 0.7;
  const v = 0.3 + Math.random() * 0.7;

  const hsv: HSVColor = { h, s, v };
  const rgb = hsvToRgb(h, s, v);
  const hex = rgbToHex(rgb.r, rgb.g, rgb.b);

  return {
    hsv,
    rgb,
    hex,
    x: 0,
    y: 0,
  };
}

export function generateColorOptions(count: number = 4): ColorWithPosition[] {
  const colors: ColorWithPosition[] = [];
  for (let i = 0; i < count; i++) {
    colors.push(generateVibrantColor());
  }
  return colors;
}

export function calculateHSVDistance(
  color1: HSVColor,
  color2: HSVColor
): number {
  const hDiff = Math.min(
    Math.abs(color1.h - color2.h),
    360 - Math.abs(color1.h - color2.h)
  ) / 180;

  const sDiff = Math.abs(color1.s - color2.s);
  const vDiff = Math.abs(color1.v - color2.v);

  return Math.sqrt(hDiff ** 2 + sDiff ** 2 + vDiff ** 2) / Math.sqrt(3);
}

export function calculateScore(distance: number): number {
  if (distance < 0.02) return 6;
  if (distance < 0.08) return 5;
  if (distance < 0.15) return 4;
  if (distance < 0.25) return 3;
  if (distance < 0.4) return 2;
  if (distance < 0.6) return 1;
  return 0;
}

export function hsvToPosition(
  hsv: HSVColor,
  canvasWidth: number,
  canvasHeight: number
): { x: number; y: number } {
  const centerX = canvasWidth / 2;
  const centerY = canvasHeight / 2;
  const maxRadius = Math.min(centerX, centerY) * 0.9;

  const angle = (hsv.h * Math.PI) / 180;
  const radius = hsv.s * maxRadius;

  const x = centerX + radius * Math.cos(angle);
  const y = centerY + radius * Math.sin(angle);

  return { x, y };
}

export function positionToHSV(
  x: number,
  y: number,
  canvasWidth: number,
  canvasHeight: number
): HSVColor {
  const centerX = canvasWidth / 2;
  const centerY = canvasHeight / 2;
  const maxRadius = Math.min(centerX, centerY) * 0.9;

  const dx = x - centerX;
  const dy = y - centerY;

  let h = (Math.atan2(dy, dx) * 180) / Math.PI;
  if (h < 0) h += 360;

  const radius = Math.sqrt(dx ** 2 + dy ** 2);
  const s = Math.min(radius / maxRadius, 1);

  return { h, s, v: 0.8 };
}
