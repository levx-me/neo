'use client'
import { Character } from '@/Components/Character';
import {
    COLUMNS,
    ROWS,
    generateColors,
    getRandomSeed,
    getRandomColor,
    getCharAt,
    getColorAt,
    getIntervalAt,
} from '@/Helpers';
import { ICharacter, IMatrix, IRow, TColor, THexColor, TSeed, chars, hyeroglyphs, defaultHieroglyphColor } from '@/Types';
import { Box } from '@mui/material';
import React, { createContext, Dispatch, ReactNode, SetStateAction, useEffect } from 'react';
import { FC } from 'react';
import { toHex, fromHex } from 'viem';

interface ICharacterExport {
    i: number;
    c: THexColor;
    h: number;
}
interface ICharacterSvg {
    character: string;
    color: THexColor;
}


export const defaultBgColors: Array<THexColor> = [
    '#ff5555',
    '#dd3333',
    '#881111',
    '#881111',
    '#551111',
];
export interface IMatrixContext {
    Matrix: ReactNode | null;
    matrix: IMatrix;
    seed: TSeed;
    setHieroglyph: (x: number, y: number, isHieroglyph: boolean, hieroglyphChar?: string) => void;
    newMatrix: () => void;
    resetMatrix: () => void;
    setHieroglyphColor: (color: THexColor) => void;
    setBackgroundColor: (color: THexColor) => void;
    saveJson: () => void;
    encodeData: () => void;
    decodeData: (data: string) => void;
    mint: () => void;
}
export const MatrixContext = createContext<IMatrixContext>({
    Matrix: null,
    setHieroglyph: (x: number, y: number, isHieroglyph: boolean, hieroglyphChar?: string) => { },
    matrix: [],
    seed: new Uint8Array(32),
    newMatrix: () => { },
    resetMatrix: () => { },
    setHieroglyphColor: (color: THexColor) => { },
    setBackgroundColor: (color: THexColor) => { },
    saveJson: () => { },
    encodeData: () => { },
    decodeData: (data: string) => { },
    mint: () => { },
});

const initialSeed = getRandomSeed();
export const MatrixProvider: FC<{ children: ReactNode }> = (props) => {
    const [matrix, setMatrix] = React.useState<IMatrix>([[]]);
    const [seed, setSeed] = React.useState<TSeed>(initialSeed);
    const [isStarted, setIsStarted] = React.useState<boolean>(false);
    const [backgroundColors, setBackgroundColors] =
        React.useState<THexColor[]>(defaultBgColors);
    const [hieroglyphColor, sethieroglyphColor] =
        React.useState<THexColor>(defaultHieroglyphColor);

    const generateRow = (columns: number, rowIndex: number): IRow => {
        const row: IRow = [];
        for (let colIndex = 0; colIndex < columns; colIndex++) {
            row.push({
                char: getCharAt(seed, rowIndex, colIndex),
                color: getColorAt(backgroundColors, seed, rowIndex, colIndex),
                interval: getIntervalAt(seed, rowIndex, colIndex),
                hieroglyph: false,
                hieroglypColor: defaultHieroglyphColor,
                x: colIndex,
                y: rowIndex,
            });
        }
        return row;
    };

    const buildMatrix = (rows: number, columns: number): IMatrix => {
        const matrix: IMatrix = [];
        for (let index = 0; index < rows; index++) {
            const row: IRow = generateRow(columns, index);
            matrix.push(row);
        }
        return matrix;
    };
    const matrixComponents = isStarted ? (
        <div>
            {matrix.map((row: IRow, rowIndex: number) => (
                <Box sx={{ display: 'flex' }} key={`row-${rowIndex}`}>
                    {row.map((char: ICharacter, colIndex: number) => (
                        <Character data={char} key={`col-${colIndex}`} />
                    ))}
                </Box>
            ))}
        </div>
    ) : (
        <></>
    );
    useEffect(() => {
        setTimeout(() => {
            setBackgroundColors(defaultBgColors);
            setMatrix(buildMatrix(ROWS, COLUMNS));
            setIsStarted(true);
        }, 100);
    }, []);

    function newMatrix() {
        setSeed(getRandomSeed());
        setTimeout(() => {
            setMatrix(buildMatrix(ROWS, COLUMNS));
        }, 100);
    }

    function resetMatrix() {
        const newMatrix: IMatrix = [];
        matrix.forEach((row: IRow) => {
            const newRow: IRow = [];
            row.forEach((char: ICharacter) => {
                newRow.push({
                    ...char,
                    hieroglyph: false,
                });
            });
            newMatrix.push(newRow);
        });
        setMatrix(newMatrix);
    }

    function setBg(colors: THexColor[]) {
        const newMatrix: IMatrix = [];
        matrix.forEach((row: IRow) => {
            const newRow: IRow = [];
            row.forEach((char: ICharacter) => {
                newRow.push({
                    ...char,
                    color: getRandomColor(colors),
                });
            });
            newMatrix.push(newRow);
        });
        setMatrix(newMatrix);
    }

    function setHieroglyph(x: number, y: number, hieroglyph: boolean, hieroglyphChar?: string) {
        const cell = matrix[y][x];
        let newMatrix = matrix;
        newMatrix[y][x] = { ...cell, hieroglyphChar: hieroglyph ? hieroglyphChar : undefined, hieroglyph: hieroglyph, hieroglypColor: hieroglyphColor };
        setMatrix(newMatrix);
    }

    function setBackgroundColor(color: THexColor) {
        // setColor({ color, textShadow: '' });
        const colors = generateColors(color);
        setBackgroundColors(colors);
        setBg(colors);
    }
    function setHieroglyphColor(color: THexColor) {
        sethieroglyphColor(color);
    }

    function generateCharacterSVG(characters: ICharacterSvg[][]): string {
        // Define the size of each cell in the grid
        const cellWidth = 10;
        const cellHeight = 10;

        // Start the SVG string
        let svgString = `<svg width="${48 * cellWidth}" height="${36 * cellHeight}" xmlns="http://www.w3.org/2000/svg">`;
        svgString += `<rect width="100%" height="100%" fill="black"/>`;

        // Loop through each row and each cell in the 2D array
        characters.forEach((row, rowIndex) => {
            row.forEach((cell, cellIndex) => {
                // For each character, add a text element to the SVG
                svgString += `
                    <text x="${cellIndex * cellWidth + cellWidth / 2}" y="${rowIndex * cellHeight + cellHeight / 2}" fill="${cell.color}" font-family="monospace" font-size="10" alignment-baseline="middle" text-anchor="middle">
                        ${cell.character}
                    </text>`;
            });
        });

        // Close the SVG string
        svgString += '</svg>';

        console.log(svgString)

        return svgString;
    }

    /*
        Data = <Seed in bytes32>
        <M in uint8> <backgroundColor0 in bytes3> ... <backgroundColor(M - 1) in bytes3>
        <N in uint8> <color0 in bytes3> <color1 in bytes3> … <color(N - 1) in bytes3>
        <L in uint16> <hieroglyph0 in Hieroglyph> <hieroglyph1 in Hieroglyph> … <hieroglyph(L - 1) in Hieroglyph>

        Hieroglyph in bytes3 = <row in uint6> <column in uint6> <hieroglyphIndex in uint4> <hieroglyphColorIndex in uint8>
    */
    function encodeData(): string {
        let data = toHex(seed);
        data += backgroundColors.length.toString(16).padStart(2, "0");
        backgroundColors.forEach((color: THexColor) => {
            data += color.substring(1).toLowerCase();
        });

        let colorSet = new Set<string>();
        let hieroglyphCount = 0;
        matrix.forEach((r: IRow, ri: number) => {
            r.forEach((c: ICharacter, ci: number) => {
                if (c.hieroglypColor.length != 7) throw new Error(`Wrong color ${c.hieroglypColor} at row ${ri} column ${ci}`);
                if (c.hieroglyph) {
                    hieroglyphCount += 1;
                    colorSet.add(c.hieroglypColor.substring(1).toLowerCase());
                }
            });
        });

        const colors = Array.from(colorSet);
        if (colors.length >= 256) throw new Error(`Colors exceeded limit`);
        data += colors.length.toString(16).padStart(2, "0");
        for (const color of colors) {
            data += color;
        }

        data += hieroglyphCount.toString(16).padStart(4, "0");
        matrix.forEach((r: IRow, ri: number) => {
            r.forEach((c: ICharacter, ci: number) => {
                if (c.hieroglyph) {
                    if (ri >= 2**6) throw new Error(`Row index ${ri} exceeded limit`);
                    if (ci >= 2**6) throw new Error(`Column index ${ci} exceeded limit`);
                    const index = hyeroglyphs.indexOf(c.hieroglyphChar);
                    if (index == -1) throw new Error(`Hieroglyph ${c.hieroglyphChar} not found at row ${ri} column ${ci}`)
                    if (index >= 2**4) throw new Error(`Hieroglyph index ${index} exceeded limit`);
                    const colorIndex = colors.indexOf(c.hieroglypColor.substring(1));
                    if (colorIndex == -1) throw new Error(`Color ${c.color} not found at row ${ri} column ${ci}`)
                    const value = (ri << 18) + (ci << 12) + (index << 8) + colorIndex;
                    data += value.toString(16).padStart(6, "0");
                }
            });
        });

        console.log('matrix')
        console.log(matrix)
        console.log('data')
        console.log(data)
        console.log('decodeData(data)');
        console.log(decodeData(data));

        console.log(areMatricesEqual(matrix, decodeData(data)))

        return data;
    }

    function decodeData(encodedData: string): ICharacter[][] {
        if (encodedData.startsWith("0x")) {
            encodedData = encodedData.substring(2);
        }

        const seed = fromHex("0x" + encodedData.substring(0, 64), "bytes");
        encodedData = encodedData.substring(64);
        setSeed(seed);

        const bgColorCount = parseInt(encodedData.substring(0, 2), 16);
        encodedData = encodedData.substring(2);

        const bgColors = new Array<THexColor>();
        for (let i = 0; i < bgColorCount; i++) {
            bgColors.push(`#${encodedData.substring(0, 6)}`);
            encodedData = encodedData.substring(6);
        }
        setBackgroundColors(bgColors);

        const colorCount = parseInt(encodedData.substring(0, 2), 16);
        encodedData = encodedData.substring(2);

        const colors = new Array<THexColor>();
        for (let i = 0; i < colorCount; i++) {
            colors.push(`#${encodedData.substring(0, 6)}`);
            encodedData = encodedData.substring(6);
        }

        const matrix = buildMatrix(ROWS, COLUMNS);

        const hieroglyphCount = parseInt(encodedData.substring(0, 4), 16);
        encodedData = encodedData.substring(4);

        for (let i = 0; i < hieroglyphCount; i++) {
            const hieroglyph = parseInt(encodedData.substring(0, 6), 16);
            encodedData = encodedData.substring(6);

            const row = (hieroglyph >> 18) & 0x3f; // uint6
            const col = (hieroglyph >> 12) & 0x3f; // uint6
            const index = (hieroglyph >> 8) & 0x0f; // uint4
            const colorIndex = hieroglyph & 0xff;
            const color = colors[colorIndex];

            const char = matrix[row][col];
            matrix[row][col] = {
                ...char,
                char: hyeroglyphs[index],
                hieroglyph: true,
                hieroglyphColor: color
            }
        }

        return matrix;
    }

    function areMatricesEqual(matrix1: ICharacter[][], matrix2: ICharacter[][]): boolean {
        // Check if both matrices have the same number of rows
        if (matrix1.length !== matrix2.length) {
            return false;
        }

        // Now check each row
        for (let row = 0; row < matrix1.length; row++) {
            // Check if the current rows have the same number of columns
            if (matrix1[row].length !== matrix2[row].length) {
                return false;
            }

            // Compare the color and hieroglyph properties of each ICharacter in the current row
            for (let col = 0; col < matrix1[row].length; col++) {
                if (matrix1[row][col].color !== matrix2[row][col].color ||
                    matrix1[row][col].hieroglyph !== matrix2[row][col].hieroglyph ||
                    matrix1[row][col].hieroglypColor !== matrix2[row][col].hieroglypColor
                ) {
                    // If there's a mismatch, the matrices are not the same
                    return false;
                }
            }
        }

        // If no mismatches were found, the matrices are the same
        return true;
    }

    // Example usage:
    const matrix1: ICharacter[][] = [/* ... */];
    const matrix2: ICharacter[][] = [/* ... */];

    const isEqual = areMatricesEqual(matrix1, matrix2);
    console.log(isEqual); // This will log 'true' if they're the same, 'false' otherwise.






    function saveJson() {
        const newMatrix: ICharacterSvg[][] = [];
        matrix.forEach((row: IRow, index: number) => {
            const newRow: ICharacterSvg[] = []
            row.forEach((c: ICharacter) => {
                newRow.push({
                    color: c.hieroglyph ? c.hieroglypColor : c.color,
                    character: c.char
                });
            });
            newMatrix.push(newRow)
        });

        const svg = generateCharacterSVG(newMatrix)
        const blob = new Blob([svg], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'data.svg';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    function saveSvg() {
        const newMatrix: ICharacterExport[] = [];
        matrix.forEach((row: IRow, index: number) => {
            row.forEach((c: ICharacter) => {
                newMatrix.push({
                    i: c.interval,
                    c: c.hieroglyph ? c.hieroglypColor : c.color,
                    h: c.hieroglyph ? 1 : 0,
                });
            });
        });
        const jsonStr = JSON.stringify(newMatrix, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'data.json';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    function mint() {
        const encodedData = encodeData()
        // console.log(decodeData('0x04881111551111dd3333ff555500070009002300040006000300470064000100090000002800280007006700490064004f004f0025000f0004006100050062002300070007006f0042000500470065000500090066002400060021002200270065004000020005006600000062'))
        // const decodedData = decodeData(encodedData)
        // console.log('decodedData')
        // console.log(decodedData)
    }

    return (
        <MatrixContext.Provider
            value={{
                Matrix: matrixComponents,
                matrix,
                seed,
                setHieroglyph,
                newMatrix,
                resetMatrix,
                setHieroglyphColor,
                setBackgroundColor,
                saveJson,
                encodeData,
                decodeData,
                mint
            }}
        >
            {props.children}
        </MatrixContext.Provider>
    );
};
