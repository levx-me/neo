'use client';
import { ICharacterProps, defaultHieroglyphColor } from '@/Types';
import React, { FC, useEffect } from 'react';
import localFont from 'next/font/local';
import { Box } from '@mui/material';
import { getNextChar, getNextHieroglyph, getRandomChar, getRandomHieroglyph } from '@/Helpers';
import { useMousedownContext } from '@/Hooks/useMousedownContext';
import { useMatrixContext } from '@/Hooks/useMatrixContext';

export const TickingTimeBomb = localFont({ src: '/TickingTimebombBB.ttf' });
export const Character: FC<ICharacterProps> = ({ data }) => {
    const [isStarted, setisStarted] = React.useState<boolean>(false);
    const [character, setCharacter] = React.useState<string>(data.char);
    const mouseDown = useMousedownContext();
    const matrix = useMatrixContext();
    const characterData = matrix.matrix[data.y][data.x];
    const isHieroglyph = characterData.hieroglyph;
    const color = characterData.color;
    const hieroglyphColor = characterData.hieroglyphColor;
    const char = characterData.char;
    useEffect(() => {
        if (!isStarted) {
            setTimeout(() => {
                setisStarted(true);
            }, 1);
        }
    }, []);

    useEffect(() => {
        console.log('dick');
        setCharacter(getNextChar(char));
    }, [matrix.tick]);

    function changeHieroglyph() {
        matrix.setHieroglyph(data.x, data.y, true);
        setCharacter(getRandomHieroglyph());
    }

    function changeCharacter() {
        matrix.setHieroglyph(data.x, data.y, false);
        setCharacter(getRandomChar());
    }

    useEffect(() => {
        if (isHieroglyph) {
            setCharacter(getRandomHieroglyph());
        } else {
            setCharacter(getRandomChar());
        }
    }, [isHieroglyph]);

    return (
        <Box
            onClick={(event: React.MouseEvent<HTMLDivElement>) => {
                console.log('x: ', data.x, ' y ', data.y);
                changeHieroglyph();
            }}
            onContextMenu={(event: React.MouseEvent<HTMLDivElement>) => {
                changeCharacter();
            }}
            onPointerEnter={() => {
                if (mouseDown.mouseDown) {
                    changeHieroglyph();
                }

                if (mouseDown.mouseRightDown) {
                    changeCharacter();
                }
            }}
            sx={{
                fontFamily: TickingTimeBomb.style.fontFamily,
                color: isHieroglyph ? hieroglyphColor : color,
                textShadow: isHieroglyph ? hieroglyphColor.textShadow : color.textShadow,
                fontSize: isHieroglyph ? '12px' : '14px',
                // display: 'inline-block',
                // padding: "1px 1px",
                width: '18px',
                // height: '28px',
                // overflow: 'hidden',
                userSelect: 'none',
                lineHeight: '14px',
                textAlign: 'center',
                padding: '1px 0 !important',
                '&:hover': {
                    background: isHieroglyph
                        ? `${hieroglyphColor.color}55`
                        : `${color.color}55`,
                },
                fontWeight: '600',
            }}
        >
            {char}
        </Box>
    );
};
