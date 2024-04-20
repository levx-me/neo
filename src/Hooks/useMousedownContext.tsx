import { MousedownContext } from "@/Context/MousedownContext";
import { useContext } from "react";
export const useMousedownContext = () => {
  return useContext(MousedownContext);
};
