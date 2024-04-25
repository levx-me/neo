'use client';
import { ICharacterProps, defaultHieroglyphColor } from '@/Types';
import React, { FC, useEffect } from 'react';
import localFont from 'next/font/local';
import { Box } from '@mui/material';
import {
    generateTextShadow,
    getNextChar,
    getNextHieroglyph,
    getRandomChar,
    getRandomHieroglyph,
} from '@/Helpers';
import { useMousedownContext } from '@/Hooks/useMousedownContext';
import { useMatrixContext } from '@/Hooks/useMatrixContext';

export const TickingTimeBomb = localFont({ src: '/TickingTimebombBB.ttf' });
export const Character: FC<ICharacterProps> = ({ data }) => {
    const [isStarted, setisStarted] = React.useState<boolean>(false);
    const [character, setCharacter] = React.useState<string>(data.char);
    const mouseDown = useMousedownContext();
    const matrix = useMatrixContext();
    const isHieroglyph = matrix.matrix[data.y][data.x].hieroglyph;
    const color = matrix.matrix[data.y][data.x].color;
    const hieroglyphColor = matrix.matrix[data.y][data.x].hieroglypColor;

    useEffect(() => {
        if (!isStarted) {
            setTimeout(() => {
                setisStarted(true);
            }, 100);
        }
    }, []);

    useEffect(() => {
        setCharacter(data.char);
    }, matrix.matrix);

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

    useEffect(() => {
        let intervalId: any;

        if (isStarted) {
            intervalId = setInterval(() => {
                if (isHieroglyph) {
                    try {
                        setCharacter((currentChar) => {
                            return getNextHieroglyph(currentChar);
                        });
                    } catch (error) {
                        setCharacter(getRandomHieroglyph());
                    }
                } else {
                    try {
                        setCharacter((currentChar) => {
                            return getNextChar(currentChar);
                        });
                    } catch (error) {
                        setCharacter(getRandomChar());
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
    }, [isStarted, isHieroglyph]);
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
                textShadow: isHieroglyph
                    ? generateTextShadow(hieroglyphColor)
                    : generateTextShadow(color),
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
                    background: isHieroglyph ? `${hieroglyphColor}55` : `${color}55`,
                },
                fontWeight: '600',
            }}
        >
            {character}
        </Box>
    );
};
