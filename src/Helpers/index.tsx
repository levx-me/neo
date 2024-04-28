import { TColor, THexColor, TSeed, chars, defaultBgColors, hyeroglyphs as hieroglyph } from '@/Types';
import { keccak256, toHex, toBytes } from "viem";

export const COLUMNS = 48;
export const ROWS = 36;

export const step = 50;
export const minInterval = 300;
export const maxInterval = 2000;

export function getRandomSeed() {
    const random = Math.random().toString();
    return keccak256(toBytes(random), "bytes");
}

function getValue(seed: TSeed, row: number, col: number) {
    row += 1;
    col += 1;
    const x = seed[Math.floor(col / row) % 32] + seed[col % 32];
    const y = seed[Math.floor(row / col) % 32] + seed[row % 32];
    return Math.floor(Math.sqrt(seed[x % 32] * seed[y % 32]));
}

export function getCharAt(seed: TSeed, row: number, col: number) {
    const value = getValue(seed, row, col);
    return chars[value % chars.length];
}

export function getRandomColor(colors: THexColor[]): THexColor {
    return colors[Math.floor(Math.random() * colors.length)];
}

export function getColorAt(colors: THexColor[], seed: TSeed, row: number, col: number): THexColor {
    const value = getValue(seed, row, col);
    return colors[value % colors.length];
}

export function getNextChar(currentChar: string) {
    const index = chars.indexOf(currentChar); // Find the index of the current character
    if (index === -1) {
        return ' ';
    }
    return chars[(index + 1) % chars.length]; // Get the next character, wrap around using modulo
}

export function getRandomHieroglyph() {
    return hieroglyph[Math.floor(Math.random() * chars.length)];
}

export function getHieroglyphAt(seed: TSeed, row: number, col: number) {
    const value = getValue(seed, row, col);
    return hieroglyph[value % hieroglyph.length];
}

export function getNextHieroglyph(currentChar: string) {
    const index = hieroglyph.indexOf(currentChar); // Find the index of the current character
    if (index === -1) {
        return ' ';
    }
    return hieroglyph[(index + 1) % hieroglyph.length]; // Get the next character, wrap around using modulo
}

export function generateTextShadow(color: THexColor) {
    const blur = '3px';
    const blur2 = '6px';
    const opacityModifier = '88';
    const opacityModifier2 = '44';

    return `0px 0px ${blur} ${color}${opacityModifier}, 0px 0px ${blur2} ${color}${opacityModifier2}`;
}

export function getIntervalAt(seed: TSeed, row: number, col: number) {
    const value = getValue(seed, row, col);
    const numStep = (maxInterval - minInterval) / step;
    // Use a power less than 1 to bias towards higher intervals
    const randomFactor = (value / 256) ** 0.8; // Biasing towards higher numbers
    const adjustedStep = Math.floor(randomFactor * numStep + 1);
    // return minInterval + step;
    return minInterval + adjustedStep * step;
}

export function generateColors(color: THexColor): THexColor[] {
    const hexColor = color.length === 9 ? color.substring(0, 7) : color;

    // Helper function to adjust color brightness
    function adjustColor(color: string, amount: number) {
        let usePound = false;

        if (color[0] === '#') {
            color = color.slice(1);
            usePound = true;
        }

        const num = parseInt(color, 16);
        let r = (num >> 16) + amount;
        if (r > 255) r = 255;
        else if (r < 0) r = 0;

        let g = ((num >> 8) & 0x00ff) + amount;
        if (g > 255) g = 255;
        else if (g < 0) g = 0;

        let b = (num & 0x0000ff) + amount;
        if (b > 255) b = 255;
        else if (b < 0) b = 0;

        return (usePound ? '#' : '') + ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
    }

    // Calculate slightly brighter and darker colors
    const slightlyBrighterHexColor = adjustColor(hexColor, 60);
    const slightlyDarkerHexColor = adjustColor(hexColor, -60);

    // Construct text shadows for each color
    const colors = [hexColor, hexColor, slightlyBrighterHexColor, slightlyDarkerHexColor];

    return colors as THexColor[];
}
