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
export const defaultBgColors: Array<TColor> = [
    {
        color: '#ff5555',
        textShadow: `0px 0px ${blur} #ff6666${opacityModifier}, 0px 0px ${blur2} #ff6666${opacityModifier2}`,
    },
    {
        color: '#dd3333',
        textShadow: `0px 0px ${blur} #dd3333${opacityModifier}, 0px 0px ${blur2} #dd3333${opacityModifier2}`,
    },
    // { color: "#cc4444", textShadow: "0px 0px 10px #c44, 0px 0px 10px #c44" },
    // { color: "#44ff44", textShadow: "0px 0px 10px #c44, 0px 0px 10px #c44" },
    // { color: "#aa2222", textShadow: "0px 0px 10px #a22, 0px 0px 10px #a22" },
    // { color: "#2222cc", textShadow: "0px 0px 10px #22c, 0px 0px 10px #22c" },
    {
        color: '#881111',
        textShadow: `0px 0px ${blur} #991111${opacityModifier}, 0px 0px ${blur2} #991111${opacityModifier2}`,
    },
    {
        color: '#881111',
        textShadow: `0px 0px ${blur} #991111${opacityModifier}, 0px 0px ${blur2} #991111${opacityModifier2}`,
    },
    {
        color: '#551111',
        textShadow: `0px 0px ${blur} #551111${opacityModifier}, 0px 0px ${blur2} #551111${opacityModifier2}`,
    },
];
export interface IMatrixContext {
    Matrix: ReactNode | null;
    matrix: IMatrix;
    setHieroglyph: (x: number, y: number, isHieroglyph: boolean) => void;
    newMatrix: () => void;
    resetMatrix: () => void;
    setHieroglyphColor: (color: THexColor) => void;
    setBackgroundColor: (color: THexColor) => void;
}
export const MatrixContext = createContext<IMatrixContext>({
    Matrix: null,
    setHieroglyph: (x: number, y: number, isHieroglyph: boolean) => {},
    matrix: [],
    newMatrix: () => {},
    resetMatrix: () => {},
    setHieroglyphColor: (color: THexColor) => {},
    setBackgroundColor: (color: THexColor) => {},
});
export const MatrixProvider: FC<{ children: ReactNode }> = (props) => {
    const [matrix, setMatrix] = React.useState<IMatrix>(buildMatrix(ROWS, COLUMNS));
    const [isStarted, setIsStarted] = React.useState<boolean>(false);
    const [backgroundColors, setBackgroundColors] = React.useState<TColor[]>([]);
    const [hieroglyphColor, sethieroglyphColor] =
        React.useState<TColor>(defaultHieroglyphColor);

    function generateRow(columns: number, rowIndex: number): IRow {
        const row: IRow = [];
        for (let colIndex = 0; colIndex < columns; colIndex++) {
            row.push({
                char: getRandomChar(),
                color: getRandomColor(defaultBgColors),
                interval: getRandomInterval(),
                hieroglyph: false,
                hieroglyphColor: defaultHieroglyphColor,
                x: colIndex,
                y: rowIndex,
            });
        }
        return row;
    }

    function buildMatrix(rows: number, columns: number): IMatrix {
        const matrix: IMatrix = [];
        for (let index = 0; index < rows; index++) {
            const row: IRow = generateRow(columns, index);
            matrix.push(row);
        }
        return matrix;
    }
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

    function setBg(colors: TColor[]) {
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
        newMatrix[y][x] = { ...char, hieroglyph, hieroglyphColor };
        setMatrix(newMatrix);
    }

    function setBackgroundColor(color: THexColor) {
        // setColor({ color, textShadow: '' });
        const colors = generateColors(color);
        setBackgroundColors(colors);
        setBg(colors);
    }
    function setHieroglyphColor(color: THexColor) {
        sethieroglyphColor({ color, textShadow: '' });
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
            }}
        >
            {props.children}
        </MatrixContext.Provider>
    );
};
