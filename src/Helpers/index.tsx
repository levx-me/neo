import { TColor, chars, colors, hyeroglyphs } from "@/Types";
export const step = 50;

export const COLUMNS = 48;
export const ROWS = 36;
export const minInterval = 100;
export const maxInterval = 2000;

export function getRandomChar() {
  return chars[Math.floor(Math.random() * chars.length)];
}

export function getRandomColor(): TColor {
  return colors[Math.floor(Math.random() * colors.length)];
}

export function getNextChar(currentChar: string) {
  const index = chars.indexOf(currentChar); // Find the index of the current character
  if (index === -1) {
    return " ";
  }
  return chars[(index + 1) % chars.length]; // Get the next character, wrap around using modulo
}
export function getNextHyeroglyph(currentChar: string) {
  const index = hyeroglyphs.indexOf(currentChar); // Find the index of the current character
  if (index === -1) {
    return " ";
  }
  return hyeroglyphs[(index + 1) % hyeroglyphs.length]; // Get the next character, wrap around using modulo
}

export function getRandomInterval() {
  const numStep = (maxInterval - minInterval) / step;
  // Use a power less than 1 to bias towards higher intervals
  const randomFactor = Math.random() ** 0.5; // Biasing towards higher numbers
  const adjustedStep = Math.floor(randomFactor * numStep + 1);
  return minInterval + adjustedStep * step;
}
