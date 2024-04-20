'use client';
import { ICharacterProps } from '@/Types';
import React, { FC, useEffect } from 'react';
import localFont from 'next/font/local';
import { Box } from '@mui/material';
import { getNextChar, getNextHieroglyph, getRandomChar, getRandomHieroglyph } from '@/Helpers';
import { useMousedownContext } from '@/Hooks/useMousedownContext';

export const TickingTimeBomb = localFont({ src: '/TickingTimebombBB.ttf' });
export const Character: FC<ICharacterProps> = ({ data }) => {
    const [isStarted, setisStarted] = React.useState<boolean>(false);
    const [isHieroglyph, setIsHieroglyph] = React.useState<boolean>(false);
    const [character, setCharacter] = React.useState<string>(data.char);
    const mouseDown = useMousedownContext();

    useEffect(() => {
        if (!isStarted) {
            setTimeout(() => {
                setisStarted(true);
            }, 1000);
        }
    }, []);

    function changeHieroglyph() {
        setIsHieroglyph(true);
        setCharacter(getRandomHieroglyph());
    }

    function changeCharacter() {
        setIsHieroglyph(false);
        setCharacter(getRandomChar());
    }

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
    }, [isStarted, data.interval, isHieroglyph]);
    return (
        <Box
            onClick={(event: React.MouseEvent<HTMLDivElement>) => {
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
                color: isHieroglyph ? '#aaaa22' : data.color.color,
                textShadow: isHieroglyph
                    ? '0px 0px 10px #aa11aa, 0px 0px 10px #aa11aa'
                    : data.color.textShadow,
                fontSize: isHieroglyph ? '12px' : '20px',
                display: 'inline-block',
                // padding: "1px 1px",
                width: '22px',
                userSelect: 'none',
                textAlign: 'center',
                '&:hover': {
                    background: '#330000',
                },
                fontWeight: '600',
            }}
        >
            {character}
        </Box>
    );
};
