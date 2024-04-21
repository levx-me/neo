'use client';
import { Box, Button, Grid } from '@mui/material';
import React, { FC, ReactNode } from 'react';
import { useMousedownContext } from '@/Hooks/useMousedownContext';
import { useMatrixContext } from '@/Hooks/useMatrixContext';
import {
    COLORS,
    ICharacter,
    IRow,
    THexColor,
    defaultBgColors,
    defaultHieroglyphColor,
    sxButton,
    sxColorInput,
    yatra,
} from '@/Types';
import { MuiColorInput } from 'mui-color-input';
import { Character } from './Character';

// If loading a variable font, you don't need to specify the font weight

export const Matrix: FC = () => {
    const mouseDown = useMousedownContext();
    const Matrix = useMatrixContext();
    const [charColor, setCharColor] = React.useState<string>(defaultBgColors[0].color);
    const [hieroglyphColor, setHieroglyphColor] = React.useState<string>(
        defaultHieroglyphColor.color,
    );
    const handleCharColorChange = (color: string) => {
        setCharColor(color);
    };
    const handleHieroglyphColorChange = (color: string) => {
        setHieroglyphColor(color);
    };

    return (
        <Grid
            container
            direction={'column'}
            // justifyContent={'center'}
            alignItems={'left'}
            sx={{
                height: '100vh',
                padding: '4rem 0 0 4rem ',
            }}
            onMouseDown={(event: React.MouseEvent<HTMLDivElement>) => {
                if (event.button === 0) {
                    mouseDown.handleMouseDown(true);
                } else if (event.button === 2) {
                    mouseDown.handleRightMouseDown(true);
                }
            }}
            onMouseUp={(e) => {
                mouseDown.handleMouseDown(false);
                mouseDown.handleRightMouseDown(false);
            }}
        >
            <Grid
                item
                sx={{
                    width: 'fit-content',
                }}
            >
                <Box
                    onContextMenu={(e) => e.preventDefault()}
                    sx={{
                        width: 'fit-content',
                        background: 'black',
                        padding: '1rem',
                    }}
                >
                    {Matrix.isStarted ? (
                        <div>
                            {Matrix.matrix.map((row: IRow, rowIndex: number) => (
                                <Box sx={{ display: 'flex' }} key={`row-${rowIndex}`}>
                                    {row.map((char: ICharacter, colIndex: number) => (
                                        <Character data={char} key={`col-${colIndex}`} />
                                    ))}
                                </Box>
                            ))}
                        </div>
                    ) : (
                        <></>
                    )}
                </Box>
                <Grid
                    item
                    justifyContent={'space-between'}
                    sx={{
                        marginTop: '1rem',
                        display: 'flex',
                        fontFamily: yatra.style.fontFamily,
                    }}
                >
                    <Button
                        sx={{ ...sxButton, marginRight: '1rem' }}
                        disableRipple
                        onClick={Matrix.newMatrix}
                    >
                        {/* New Seed */}
                        {Matrix.tick}
                    </Button>
                    <Button
                        sx={{ ...sxButton, marginRight: '1rem' }}
                        disableRipple
                        onClick={Matrix.resetMatrix}
                    >
                        Reset
                    </Button>

                    <Box>
                        <MuiColorInput
                            sx={sxColorInput}
                            format="hex"
                            value={charColor}
                            onChange={handleCharColorChange}
                            PopoverProps={{
                                sx: {
                                    '& .MuiColorInput-AlphaSlider': {
                                        display: 'none',
                                    },
                                },
                            }}
                        />
                        <Button
                            sx={{
                                ...sxButton,
                                marginRight: '1rem',
                                borderLeft: `2px solid ${COLORS.yellow}`,
                            }}
                            disableRipple
                            onClick={() => Matrix.setBackgroundColor(charColor as THexColor)}
                        >
                            Set
                        </Button>
                    </Box>

                    <Box>
                        <MuiColorInput
                            sx={sxColorInput}
                            format="hex"
                            value={hieroglyphColor}
                            onChange={handleHieroglyphColorChange}
                            PopoverProps={{
                                sx: {
                                    '& .MuiColorInput-AlphaSlider': {
                                        display: 'none',
                                    },
                                },
                            }}
                        />
                        <Button
                            sx={{
                                ...sxButton,
                                marginRight: '1rem',
                                borderLeft: `2px solid ${COLORS.yellow}`,
                            }}
                            disableRipple
                            onClick={() =>
                                Matrix.setHieroglyphColor(hieroglyphColor as THexColor)
                            }
                        >
                            Set
                        </Button>
                    </Box>
                </Grid>
            </Grid>
        </Grid>
    );
};
