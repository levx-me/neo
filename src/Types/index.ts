export type THexColor = `#${string}`;

export interface ICharacter {
  char: string;
  interval: number;
  color: TColor;
}

export type IRow = Array<ICharacter>;
export type IMatrix = Array<IRow>;

export interface ICharacterProps {
  data: ICharacter;
}

export const chars = [" ", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

export interface TColor {
  color: THexColor;
  textShadow: string;
}

export const colors: Array<TColor> = [
  { color: "#ff5555", textShadow: "0px 0px 10px #f66, 0px 0px 10px #f66" },
  { color: "#dd3333", textShadow: "0px 0px 10px #d33, 0px 0px 10px #d33" },
  { color: "#cc4444", textShadow: "0px 0px 10px #c44, 0px 0px 10px #c44" },
  { color: "#aa2222", textShadow: "0px 0px 10px #a22, 0px 0px 10px #a22" },
  { color: "#881111", textShadow: "0px 0px 10px #911, 0px 0px 10px #911" },
  { color: "#551111", textShadow: "0px 0px 10px #511, 0px 0px 10px #511" },
];