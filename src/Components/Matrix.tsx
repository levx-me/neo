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
export const Matrix: FC = () => {
  const COLUMNS = 48;
  const ROWS = 36;

  const minInterval = 200;
  const maxInterval = 2000;
  const step = 200;

  const [tick, setTick] = React.useState<number>(step);
  const [Matrix, setMatrixRender] = React.useState<any>(null);

  function getRandomChar() {
    return chars[Math.floor(Math.random() * chars.length)];
  }

  function getRandomColor(): TColor {
    return colors[Math.floor(Math.random() * colors.length)];
  }

  function getRandomInterval() {
    const numStep = (maxInterval - minInterval) / step;
    // const randomFactor = Math.random() ** 2;
    const randomFactor = Math.floor(Math.random() * (numStep + 1));
    return minInterval + randomFactor * step;
  }

  function generateRow(columns: number): IRow {
    const row: IRow = [];
    for (let colIndex = 0; colIndex < columns; colIndex++) {
      row.push({
        char: getRandomChar(),
        color: getRandomColor(),
        interval: getRandomInterval(),
      });
    }
    return row;
  }

  function buildMatrix(rows: number, columns: number): IMatrix {
    const matrix: IMatrix = [];
    for (let index = 0; index < rows; index++) {
      const row: IRow = generateRow(columns);
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
          {row.map((c: ICharacter, colIndex: number) => (
            <Character data={c} key={`col-${colIndex}`} />
          ))}
        </div>
      ))}
    </div>
  );

  const [isStarted, setisStarted] = React.useState<boolean>(false);

  useEffect(() => {
    setMatrix(buildMatrix(ROWS, COLUMNS));
    setMatrixRender(matrixComponents);
    if (!isStarted) {
      setTimeout(() => {
        setisStarted(true);
      }, 1000);
    }
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      tickMatrix(); // Ensure this function handles errors properly
      setTick((tick) => {
        if (tick !== maxInterval) {
          return tick + step;
        } else {
          return minInterval;
        }
      });
    }, step);
    // return () => {
    //   clearInterval(intervalId); // Clear the interval when the component unmounts
    // };
  }, [isStarted]);

  function getNextChar(char: string) {
    const currentIndex = chars.indexOf(char);
    const nextIndex = currentIndex === chars.length ? 0 : currentIndex + 1;
    return chars[nextIndex];
  }

  function tickMatrix() {
    const matrixClone = matrix;
    matrix.forEach((row: IRow, rowIndex: number) => {
      row.forEach((char: ICharacter, colIndex: number) => {
        if (char.interval % tick === 0 && tick !== step) {
          matrixClone[rowIndex][colIndex].char = getNextChar(
            matrixClone[rowIndex][colIndex].char
          );
        }
      });
    });
    setMatrix(matrixClone);
  }

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
        {tick}
        {matrixComponents}
      </Grid>
    </Grid>
  );
};
