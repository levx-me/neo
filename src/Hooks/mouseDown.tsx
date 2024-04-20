import { useState } from "react";

export const useMouseDown = () => {
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
  return { handleMouseDown, handleMouseUp, mouseIsDown };
};
