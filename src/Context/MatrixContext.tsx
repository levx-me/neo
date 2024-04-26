import { Character } from '@/Components/Character';
import {
    COLUMNS,
    ROWS,
    generateColors,
    getRandomChar,
    getRandomColor,
    getRandomInterval,
} from '@/Helpers';
import { ICharacter, IMatrix, IRow, TColor, THexColor, chars, defaultHieroglyphColor } from '@/Types';
import { Box } from '@mui/material';
import React, { createContext, Dispatch, ReactNode, SetStateAction, useEffect } from 'react';
import { FC } from 'react';
const blur = '2px';
const blur2 = '4px';
const opacityModifier = '99';
const opacityModifier2 = '55';
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
    setHieroglyph: (x: number, y: number, isHieroglyph: boolean) => void;
    newMatrix: () => void;
    resetMatrix: () => void;
    setHieroglyphColor: (color: THexColor) => void;
    setBackgroundColor: (color: THexColor) => void;
    saveJson: () => void;
    encodeData: () => void;
    decodeData: (data: string) => void;
}
export const MatrixContext = createContext<IMatrixContext>({
    Matrix: null,
    setHieroglyph: (x: number, y: number, isHieroglyph: boolean) => { },
    matrix: [],
    newMatrix: () => { },
    resetMatrix: () => { },
    setHieroglyphColor: (color: THexColor) => { },
    setBackgroundColor: (color: THexColor) => { },
    saveJson: () => { },
    encodeData: () => { },
    decodeData: (data: string) => { }
});
export const MatrixProvider: FC<{ children: ReactNode }> = (props) => {
    const [matrix, setMatrix] = React.useState<IMatrix>([[]]);
    const [isStarted, setIsStarted] = React.useState<boolean>(false);
    const [backgroundColors, setBackgroundColors] =
        React.useState<THexColor[]>(defaultBgColors);
    const [hieroglyphColor, sethieroglyphColor] =
        React.useState<THexColor>(defaultHieroglyphColor);

    const generateRow = (columns: number, rowIndex: number): IRow => {
        const row: IRow = [];
        for (let colIndex = 0; colIndex < columns; colIndex++) {
            row.push({
                char: getRandomChar(),
                color: getRandomColor(backgroundColors),
                interval: getRandomInterval(),
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
        setMatrix(buildMatrix(ROWS, COLUMNS));
    }

    function resetMatrix() {
        const newMatrix: IMatrix = [];
        matrix.forEach((row: IRow) => {
            const newRow: IRow = [];
            row.forEach((char: ICharacter) => {
                newRow.push({
                    ...char,
                    hieroglyph: false,
                    color: getRandomColor(backgroundColors),
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

    function setHieroglyph(x: number, y: number, hieroglyph: boolean) {
        const char = matrix[y][x];
        let newMatrix = matrix;
        newMatrix[y][x] = { ...char, hieroglyph: hieroglyph, hieroglypColor: hieroglyphColor };
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
        Data = <N in uint16> <color0 in bytes3> <color1 in bytes3> … <color2 in bytesN>
        <coordinate0 in Coordinate> <coordinate1 in Coordinate> … <coordinate1727 in Coordinate>

        Coordinate in bytes2 = <colorIndex in uint11> <hieroglyph in bool> <char in uint4>
        (char of value 2^4 indicates it's empty character)
    */
    function encodeData(): string {
        let colorSet = new Set<string>();
        matrix.forEach((r: IRow, ri: number) => {
            r.forEach((c: ICharacter, ci: number) => {
                if (c.color.length != 7) throw new Error(`Wrong color ${c.color} at row ${ri} column ${ci}`);
                colorSet.add(c.color.substr(1).toLowerCase());
            });
        });

        const colors = Array.from(colorSet);
        if (colors.length >= (2**16)) throw new Error(`Colors exceeded limit`);
        let data = "0x" + colors.length.toString(16).padStart(2, "0");
        for (const color of colors) {
            data += color;
        }

        matrix.forEach((r: IRow, ri: number) => {
            r.forEach((c: ICharacter, ci: number) => {
                const colorIndex = colors.indexOf(c.color.substr(1));
                if (colorIndex == -1) throw new Error(`Color ${c.color} not found at row ${ri} column ${ci}`)
                let char = (2**4) - 1;
                if (c.char != chars[0]) {
                    char = Number(c.char);
                }                 
                const coordinate = ((colorIndex << 5) + (c.hieroglyph ? 1 << 4 : 0) + (char)).toString(16).padStart(4, "0");
                const { char: ch, hieroglyph: h, color } = decodeCoordinate(colors, ri, ci, coordinate);
                if (color != c.color) throw new Error("Wrong color " + JSON.stringify(c));
                if (ch != c.char) throw new Error("Wrong ch " + JSON.stringify(c));
                if (h != c.hieroglyph) throw new Error("Wrong h " + JSON.stringify(c));
                if (coordinate.length > 4) throw new Error(`Invalid coordinate at row ${ri} column ${ci}`)
                data += coordinate;
            });
        });

        console.log(decodeData(data));

        return data;
    }

    /*
        Data = <N in uint16> <color0 in bytes3> <color1 in bytes3> … <color2 in bytesN>
        <coordinate0 in Coordinate> <coordinate1 in Coordinate> … <coordinate1727 in Coordinate>

    */
    function decodeData(data: string): IMatrix {
        if (data.startsWith("0x")) {
            data = data.substr(2);
        }
        const colorsLength = parseInt(data.substr(0, 2), 16);
        data = data.substr(2);
        const colors = new Array<string>();
        for (let i = 0; i < colorsLength; i++) {
            colors.push(data.substr(0, 6));
            data = data.substr(6);
        }

        const newMatrix: ICharacterSvg[][] = [];
        for (let row = 0; row < ROWS; row++) {
            const newRow: ICharacterSvg[] = []
            for (let column = 0; column < COLUMNS; column++) {
                const coordinate = parseInt(data.substr(0, 4), 16);
                newRow.push(decodeCoordinate(colors, row, column, coordinate));
                data = data.substr(4);
            }
            newMatrix.push(newRow);
        }
        return newMatrix;
    }

    /*
        Coordinate in bytes2 = <colorIndex in uint11> <hieroglyph in bool> <char in uint4>
        (char of value 2^4 indicates it's empty character)
    */
    function decodeCoordinate(colors: Array<string>, row: number, column: number, coordinate: string): ICharacter {
        coordinate = parseInt(coordinate, 16);
        const colorIndex = coordinate >> 5;
        if (colors.length >= (2**11)) throw new Error(`colorIndex ${colorIndex} exceeded limit at row ${row} column ${column}`);
        const hieroglyph = (coordinate % (2**5)) >> 4;
        const char = coordinate % (2**4);
        if (char != (2**4) - 1 && char > 9) throw new Error(`Invalid char ${char} at row ${row} column ${column}`);
        return {
            char: char == (2**4) - 1 ? chars[0] : char.toString(),
            interval: getRandomInterval(),
            color: `#${colors[colorIndex]}`,
            hieroglyph: hieroglyph == 1 ? true: false,
            hieroglypColor: defaultHieroglyphColor,
            x: row,
            y: column
        };
    }

    interface ICharacterExport {
        i: number;
        c: THexColor;
        h: number;
    }
    interface ICharacterSvg {
        character: string;
        color: THexColor;
    }


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

    return (
        <MatrixContext.Provider
            value={{
                Matrix: matrixComponents,
                matrix,
                setHieroglyph,
                newMatrix,
                resetMatrix,
                setHieroglyphColor,
                setBackgroundColor,
                saveJson,
                encodeData,
            }}
        >
            {props.children}
        </MatrixContext.Provider>
    );
};
