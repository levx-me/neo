import { Character } from '@/Components/Character';
import { COLUMNS, ROWS, getRandomChar, getRandomColor, getRandomInterval } from '@/Helpers';
import { ICharacter, IMatrix, IRow } from '@/Types';
import React, { createContext, ReactNode, useEffect } from 'react';
import { FC } from 'react';
export interface IMatrixContext {
    Matrix: ReactNode | null;
    matrix: IMatrix;
    setHieroglyph: (
        x: number,
        y: number,
        isHieroglyph: boolean,
        hieroglyphColor: string,
    ) => void;
    resetMatrix: () => void;
}
export const MatrixContext = createContext<IMatrixContext>({
    Matrix: null,
    setHieroglyph: (x: number, y: number, isHieroglyph: boolean, hieroglyphColor: string) => {},
    matrix: [],
    resetMatrix: () => {},
});
export const MatrixProvider: FC<{ children: ReactNode }> = (props) => {
    const [matrix, setMatrix] = React.useState<IMatrix>(buildMatrix(ROWS, COLUMNS));
    const [Matrix, setMatrixRender] = React.useState<ReactNode>(null);

    function generateRow(columns: number, rowIndex: number): IRow {
        const row: IRow = [];
        for (let colIndex = 0; colIndex < columns; colIndex++) {
            row.push({
                char: getRandomChar(),
                color: getRandomColor(),
                interval: getRandomInterval(),
                hieroglyph: false,
                hieroglyphColor: '',
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
    const matrixComponents = (
        <div>
            {matrix.map((row: IRow, rowIndex: number) => (
                <div key={`row-${rowIndex}`}>
                    {row.map((char: ICharacter, colIndex: number) => (
                        <Character data={char} key={`col-${colIndex}`} />
                    ))}
                </div>
            ))}
        </div>
    );
    useEffect(() => {
        setTimeout(() => {
            setMatrix(buildMatrix(ROWS, COLUMNS));
            setMatrixRender(matrixComponents);
        }, 100);
    }, []);

    function resetMatrix() {
        const newMatrix: IMatrix = [];
        matrix.forEach((row: IRow) => {
            const newRow: IRow = [];
            row.forEach((char: ICharacter) => {
                newRow.push({ ...char, hieroglyph: false, char: getRandomChar() });
            });
            newMatrix.push(newRow);
        });
        setMatrix(newMatrix);
        setMatrixRender(matrixComponents);
    }

    function setHieroglyph(x: number, y: number, hieroglyph: boolean, hieroglyphColor: string) {
        const char = matrix[y][x];
        let newMatrix = matrix;
        newMatrix[y][x] = { ...char, hieroglyph, hieroglyphColor };
        setMatrix(newMatrix);
    }

    return (
        <MatrixContext.Provider value={{ Matrix, matrix, setHieroglyph, resetMatrix }}>
            {props.children}
        </MatrixContext.Provider>
    );
};
