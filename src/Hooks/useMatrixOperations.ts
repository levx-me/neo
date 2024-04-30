import { COLUMNS, ROWS, getCharAt, getColorAt, getIntervalAt, getRandomSeed } from "@/Helpers";
import { ICharacter, IMatrix, IRow, T0xString, THexColor, TSeed, chars, defaultBgColors, defaultHieroglyphColor, hieroglyphs } from "@/Types";
import React from "react";
import { fromHex } from "viem";


const useMatrixOperations = () => {
    const initialSeed = getRandomSeed();
    const [seed, setSeed] = React.useState<TSeed>(initialSeed);

    const generateRow = (columns: number, rowIndex: number): IRow => {
        const row: IRow = [];
        for (let colIndex = 0; colIndex < columns; colIndex++) {
            row.push({
                char: getCharAt(seed, rowIndex, colIndex),
                color: getColorAt(backgroundColors, seed, rowIndex, colIndex),
                interval: getIntervalAt(seed, rowIndex, colIndex),
                hieroglyph: false,
                hieroglyphColor: defaultHieroglyphColor,
                hieroglyphChar: undefined,
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

    const [backgroundColors, setBackgroundColors] =
        React.useState<THexColor[]>(defaultBgColors);

    function decodeData(encodedData: string): ICharacter[][] {
        if (encodedData.startsWith("0x")) {
            encodedData = encodedData.substring(2);
        }

        const seed = fromHex(("0x" + encodedData.substring(0, 64)) as T0xString, "bytes");
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
                char: chars[index],
                hieroglyphChar: hieroglyphs[index],
                hieroglyph: true,
                hieroglyphColor: color
            }
        }

        return matrix;
    }
}