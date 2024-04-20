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
import { useMouseDown } from "@/Hooks/mouseDown";
import { useMousedownContext } from "@/Hooks/useMousedownContext";

export const Matrix: FC = () => {
  const [Matrix, setMatrixRender] = React.useState<any>(null);

  const mouseDown = useMousedownContext();

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

  return (
    <Grid
      container
      justifyContent={"center"}
      alignItems={"center"}
      sx={{ height: "100vh" }}
      onMouseDown={(e) => {
        mouseDown.handleMouseDown();
      }}
      onMouseUp={(e) => {
        mouseDown.handleMouseUp();
      }}
    >
      <Grid item>
        {mouseDown.mouseIsDown ? "true" : "false"}

        {Matrix}
        {/* {matrixComponents} */}
      </Grid>
    </Grid>
  );
};
