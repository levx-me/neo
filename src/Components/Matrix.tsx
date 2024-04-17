"use client";
import { Box, Grid } from "@mui/material";
import React, { FC, useEffect } from "react";
import { Character } from "./Character";
import {
  ICharacter,
  IMatrix,
  IRow,
  TColor,
  THexColor,
  chars,
  colors,
} from "@/Types";
import {
  COLUMNS,
  ROWS,
  getRandomChar,
  getRandomColor,
  getRandomInterval,
} from "@/Helpers";
export const Matrix: FC = () => {
  const [Matrix, setMatrixRender] = React.useState<any>(null);

  function generateRow(columns: number, rowIndex: number): IRow {
    const row: IRow = [];
    for (let colIndex = 0; colIndex < columns; colIndex++) {
      row.push({
        char: getRandomChar(),
        color: getRandomColor(),
        interval: getRandomInterval(),
        hieroglyph: false,
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
  const [matrix, setMatrix] = React.useState<IMatrix>(
    buildMatrix(ROWS, COLUMNS)
  );

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

  const [isStarted, setisStarted] = React.useState<boolean>(false);

  useEffect(() => {
    if (!isStarted) {
      setTimeout(() => {
        setisStarted(true);
      }, 1000);
    }
  }, []);

  useEffect(() => {
    if (isStarted) {
      setMatrix(buildMatrix(ROWS, COLUMNS));
      setMatrixRender(matrixComponents);
    }
  }, [isStarted]);

  // function tickMatrix() {
  //   const matrixClone = matrix;
  //   matrix.forEach((row: IRow, rowIndex: number) => {
  //     row.forEach((char: ICharacter, colIndex: number) => {
  //       if (char.interval % tick === 0 && tick !== step) {
  //         matrixClone[rowIndex][colIndex].char = getNextChar(
  //           matrixClone[rowIndex][colIndex].char
  //         );
  //       }
  //     });
  //   });
  //   setMatrix(matrixClone);
  // }

  //   useEffect(() => {

  //   }, [tick]);

  return (
    <Grid
      container
      justifyContent={"center"}
      alignItems={"center"}
      sx={{ height: "100vh" }}
    >
      <Grid item>
        {/* {tick} */}
        {Matrix}
      </Grid>
    </Grid>
  );
};
