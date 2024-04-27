import { TColor, THexColor, chars, defaultBgColors, hyeroglyphs as hieroglyph } from '@/Types';

export const COLUMNS = 48;
export const ROWS = 1;

export const step = 50;
export const minInterval = 300;
export const maxInterval = 2000;

export function getRandomChar() {
    return chars[Math.floor(Math.random() * chars.length)];
}

export function getRandomColor(colors: THexColor[]): THexColor {
    return colors[Math.floor(Math.random() * colors.length)];
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

export function getRandomInterval() {
    const numStep = (maxInterval - minInterval) / step;
    // Use a power less than 1 to bias towards higher intervals
    const randomFactor = Math.random() ** 0.8; // Biasing towards higher numbers
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
