import { Yatra_One } from 'next/font/google';
export const yatra = Yatra_One({ weight: '400', subsets: ['latin'] });

export type THexColor = `#${string}`;

export interface ICharacter {
    char: string;
    interval: number;
    color: TColor;
    hieroglyph: boolean;
    hieroglyphColor: string;
    x: number;
    y: number;
}

export type IRow = Array<ICharacter>;
export type IMatrix = Array<IRow>;

export interface ICharacterProps {
    data: ICharacter;
}

export const chars = [' ', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
export const hyeroglyphs = [' ', '𓅰', '𓃰', '𓀌', '𓋍', '𓍪', '𓍴', '𓇵', '𓀒', '𓂍', '𓀫'];
export interface TColor {
    color: THexColor;
    textShadow: string;
}

const blur = '2px';
const blur2 = '4px';
const opacityModifier = '99';
const opacityModifier2 = '55';

export const sxButton = {
    fontFamily: yatra.style.fontFamily,
    background: '#11000099',
    padding: '10px 1rem 8px 1rem',
    borderRadius: '0',
    color: '#888800',
    fontSize: '20px',
    '&:hover': {
        background: '#110000cc',
    },
    '&:active': {
        background: '#110000ff',
    },
};

export const colors: Array<TColor> = [
    {
        color: '#ff5555',
        textShadow: `0px 0px ${blur} #ff6666${opacityModifier}, 0px 0px ${blur2} #ff6666${opacityModifier2}`,
    },
    {
        color: '#dd3333',
        textShadow: `0px 0px ${blur} #dd3333${opacityModifier}, 0px 0px ${blur2} #dd3333${opacityModifier2}`,
    },
    // { color: "#cc4444", textShadow: "0px 0px 10px #c44, 0px 0px 10px #c44" },
    // { color: "#44ff44", textShadow: "0px 0px 10px #c44, 0px 0px 10px #c44" },
    // { color: "#aa2222", textShadow: "0px 0px 10px #a22, 0px 0px 10px #a22" },
    // { color: "#2222cc", textShadow: "0px 0px 10px #22c, 0px 0px 10px #22c" },
    {
        color: '#881111',
        textShadow: `0px 0px ${blur} #991111${opacityModifier}, 0px 0px ${blur2} #991111${opacityModifier2}`,
    },
    {
        color: '#881111',
        textShadow: `0px 0px ${blur} #991111${opacityModifier}, 0px 0px ${blur2} #991111${opacityModifier2}`,
    },
    {
        color: '#551111',
        textShadow: `0px 0px ${blur} #551111${opacityModifier}, 0px 0px ${blur2} #551111${opacityModifier2}`,
    },
];
