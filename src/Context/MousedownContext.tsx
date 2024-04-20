import React, { createContext, ReactNode, useState } from "react";
import { FC } from "react";
export interface IMousedownContext {
  mouseIsDown: boolean;
  handleMouseDown: () => void;
  handleMouseUp: () => void;
}
export const MousedownContext = createContext<IMousedownContext>({
  mouseIsDown: false,
  handleMouseDown: () => {},
  handleMouseUp: () => {},
});
export const MousedownProvider: FC<{ children: ReactNode }> = (props) => {
  const [mouseIsDown, setMouseIsDown] = useState(false);

  const handleMouseDown = () => {
    console.log("handleMouseDown");
    setMouseIsDown(() => {
      return true;
    });
  };

  const handleMouseUp = () => {
    console.log("handleMouseUp");
    setMouseIsDown(() => {
      return false;
    });
  };
  return (
    <MousedownContext.Provider
      value={{ mouseIsDown, handleMouseDown, handleMouseUp }}
    >
      {props.children}
    </MousedownContext.Provider>
  );
};
// useMintContext
