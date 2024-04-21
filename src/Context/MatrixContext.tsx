import { Character } from '@/Components/Character';
import { COLUMNS, ROWS, getRandomChar, getRandomColor, getRandomInterval } from '@/Helpers';
import { ICharacter, IMatrix, IRow, TColor, THexColor, defaultHieroglyphColor } from '@/Types';
import { Box } from '@mui/material';
import React, { createContext, Dispatch, ReactNode, SetStateAction, useEffect } from 'react';
import { FC } from 'react';
export interface IMatrixContext {
    Matrix: ReactNode | null;
    matrix: IMatrix;
    setHieroglyph: (x: number, y: number, isHieroglyph: boolean) => void;
    newMatrix: () => void;
    resetMatrix: () => void;
    setHieroglyphColor: (color: THexColor) => void;
}
export const MatrixContext = createContext<IMatrixContext>({
    Matrix: null,
    setHieroglyph: (x: number, y: number, isHieroglyph: boolean) => {},
    matrix: [],
    newMatrix: () => {},
    resetMatrix: () => {},
    setHieroglyphColor: (color: THexColor) => {},
});
export const MatrixProvider: FC<{ children: ReactNode }> = (props) => {
    const [matrix, setMatrix] = React.useState<IMatrix>(buildMatrix(ROWS, COLUMNS));
    const [Matrix, setMatrixRender] = React.useState<ReactNode>(null);
    const [isStarted, setIsStarted] = React.useState<boolean>(false);
    const [color, setColor] = React.useState<string>();
    const [hieroglyphColor, sethieroglyphColor] =
        React.useState<TColor>(defaultHieroglyphColor);

    function generateRow(columns: number, rowIndex: number): IRow {
        const row: IRow = [];
        for (let colIndex = 0; colIndex < columns; colIndex++) {
            row.push({
                char: getRandomChar(),
                color: getRandomColor(),
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
            setMatrix(buildMatrix(ROWS, COLUMNS));
            setMatrixRender(matrixComponents);
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
                newRow.push({ ...char, hieroglyph: false });
            });
            newMatrix.push(newRow);
        });
        setMatrix(newMatrix);
        setMatrixRender(matrixComponents);
    }

    function setHieroglyph(x: number, y: number, hieroglyph: boolean) {
        const char = matrix[y][x];
        let newMatrix = matrix;
        newMatrix[y][x] = { ...char, hieroglyph, hieroglyphColor };
        setMatrix(newMatrix);
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
            }}
        >
            {props.children}
        </MatrixContext.Provider>
    );
};
