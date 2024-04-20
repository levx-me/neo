import React, { createContext, ReactNode, useState } from "react";
import { FC } from "react";
export interface IMousedownContext {
  mouseDown: boolean;
  mouseRightDown: boolean;
  handleMouseDown: (isDown: boolean) => void;
  handleRightMouseDown: (isDown: boolean) => void;
}
export const MousedownContext = createContext<IMousedownContext>({
  mouseDown: false,
  mouseRightDown: false,
  handleMouseDown: (isDown: boolean) => {},
  handleRightMouseDown: (isDown: boolean) => {},
});
export const MousedownProvider: FC<{ children: ReactNode }> = (props) => {
  const [mouseDown, setMouseDown] = useState(false);
  const [mouseRightDown, setRightMouseDown] = useState(false);

  const handleMouseDown = (isDown: boolean) => {
    console.log("handleMouse");
    setMouseDown(isDown);
  };

  const handleRightMouseDown = (isDown: boolean) => {
    console.log("handleRightMouse");
    setRightMouseDown(isDown);
  };
  return (
    <MousedownContext.Provider
      value={{
        mouseDown,
        mouseRightDown,
        handleMouseDown,
        handleRightMouseDown,
      }}
    >
      {props.children}
    </MousedownContext.Provider>
  );
};
// useMintContext
