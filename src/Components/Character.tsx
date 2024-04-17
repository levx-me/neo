"use client";
import { ICharacter, ICharacterProps } from "@/Types";
import React, { FC, useEffect } from "react";
import localFont from "next/font/local";
import { Box } from "@mui/material";
import {
  getNextChar,
  getNextHyeroglyph,
  maxInterval,
  minInterval,
  step,
} from "@/Helpers";

export const TickingTimeBomb = localFont({ src: "/TickingTimebombBB.ttf" });
export const Character: FC<ICharacterProps> = ({ data: data }) => {
  const [tick, setTick] = React.useState<number>(step);
  const [isStarted, setisStarted] = React.useState<boolean>(false);
  const [isHieroglyph, setIsHieroglyph] = React.useState<boolean>(false);
  const [character, setCharacter] = React.useState<string>(data.char);
  useEffect(() => {
    if (!isStarted) {
      setTimeout(() => {
        setisStarted(true);
      }, 1000);
    }
  }, []);

  function click() {
    setCharacter(" ");
    setIsHieroglyph(!isHieroglyph);
  }

  useEffect(() => {
    let intervalId: any;

    if (isStarted) {
      intervalId = setInterval(() => {
        if (isHieroglyph) {
          try {
            setCharacter((currentChar) => {
              const nextChar = getNextHyeroglyph(currentChar);
              return nextChar;
            });
          } catch (error) {
            setCharacter((currentChar) => {
              const nextChar = getNextHyeroglyph(" ");
              return nextChar;
            });
          }
        } else {
          try {
            setCharacter((currentChar) => {
              const nextChar = getNextChar(currentChar);
              return nextChar;
            });
          } catch (error) {
            setCharacter((currentChar) => {
              const nextChar = getNextChar(" ");
              return nextChar;
            });
          }
        }
      }, data.interval);
    }

    // Return a cleanup function that will be called on component unmount or before re-running the effect due to dependency change
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isStarted, data.interval]);
  return (
    <Box
      onClick={() => {
        console.log(" x ", data.x, " y ", data.y);
        click();
      }}
      sx={{
        fontFamily: TickingTimeBomb.style.fontFamily,
        color: isHieroglyph ? "#888822" : data.color.color,
        textShadow: data.color.textShadow,
        fontSize: "22px",
        display: "inline-block",
        // padding: "2px 4px",
        width: "26px",
        userSelect: "none",
        textAlign: "center",
        "&:hover": {
          background: "#330000",
        },
      }}
    >
      {character}
    </Box>
  );
};
