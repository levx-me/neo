import { Yatra_One } from 'next/font/google';
export const yatra = Yatra_One({ weight: '400', subsets: ['latin'] });

export type THexColor = `#${string}`;

export interface ICharacter {
    char: string;
    interval: number;
    color: THexColor;
    hieroglyph: boolean;
    hieroglypColor: THexColor;
    x: number;
    y: number;
}

export type IRow = Array<ICharacter>;
export type IMatrix = Array<IRow>;

export interface ICharacterProps {
    data: ICharacter;
}

export const chars = [' ', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
export const hyeroglyphs = [' ', '𓅰', '𓃰', '𓀌', '𓋍', '𓍪', '𓍴', '𓇵', '𓀒', '𓂍', '𓀫'];
export const hyeroglyphs2 = [' ', '𓁶', '𓃾', '𓆓', '𓃻', '𓊽', '𓍴', '𓇵', '𓀒', '𓂍', '𓀫'];
export interface TColor {
    color: THexColor;
    textShadow: string;
}

export const defaultHieroglyphColor: THexColor = '#aaaa22';

export const COLORS = {
    yellow: '#888800',
};
export const sxButton = {
    fontFamily: yatra.style.fontFamily,
    padding: '10px 1rem 8px 1rem',
    borderRadius: '0',
    color: COLORS.yellow,
    fontSize: '20px',
    background: '#11000099',
    '&:hover': {
        background: '#110000cc',
    },
    '&:active': {
        background: '#110000ff',
    },
};

export const sxColorInput = {
    '& .MuiPaper-root': {
        background: '#222222 !important',
    },
    '& .MuiInputBase-root': {
        ...sxButton,
        padding: '0 1rem',
        border: '0px solid transparent !important',
        '--card-border-rgb': 'none',
    },
    '& .Mui-focused': {
        border: '0px solid transparent !important',
        '--card-border-rgb': 'none',
    },

    '& .MuiOutlinedInput-root': {
        borderRadius: '0',
        '& fieldset': {
            borderColor: 'transparent',
            borderWidth: '2px', // Adjust the top border width
        },
        '&:hover fieldset': {
            borderColor: 'transparent',
        },
        '&.Mui-focused fieldset': {
            borderColor: 'transparent',
        },
    },
    '& .MuiInputBase-input': {
        padding: '12px 4px',
        width: '120px',
    },
};

export const defaultBgColors: Array<THexColor> = [
    '#881111',
    '#ff5555',
    '#dd3333',
    '#881111',
    '#551111',
];
