import { Character } from '@/Components/Character';
import {
    COLUMNS,
    ROWS,
    generateColors,
    getRandomChar,
    getRandomColor,
    getRandomInterval,
} from '@/Helpers';
import { ICharacter, IMatrix, IRow, TColor, THexColor, defaultHieroglyphColor } from '@/Types';
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
}
export const MatrixContext = createContext<IMatrixContext>({
    Matrix: null,
    setHieroglyph: (x: number, y: number, isHieroglyph: boolean) => {},
    matrix: [],
    newMatrix: () => {},
    resetMatrix: () => {},
    setHieroglyphColor: (color: THexColor) => {},
    setBackgroundColor: (color: THexColor) => {},
    saveJson: () => {},
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

    interface ICharacterExport {
        i: number;
        c: THexColor;
        h: number;
    }

    function saveJson() {
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
            }}
        >
            {props.children}
        </MatrixContext.Provider>
    );
};
