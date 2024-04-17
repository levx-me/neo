"use client";
import { ICharacter, ICharacterProps } from "@/Types";
import React, { FC } from "react";
import localFont from "next/font/local";
import { Box } from "@mui/material";

export const TickingTimeBomb = localFont({ src: "/TickingTimebombBB.ttf" });
export const Character: FC<ICharacterProps> = ({ data: data }) => {
  return (
    <Box
      sx={{
        fontFamily: TickingTimeBomb.style.fontFamily,
        color: data.color.color,
        textShadow: data.color.textShadow,
        fontSize: "22px",
        display: "inline-block",
        margin: "2px",
        width: "20px",
      }}
    >
      {data.char}
    </Box>
  );
};
