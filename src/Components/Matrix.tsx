'use client';
import { Button, Grid } from '@mui/material';
import React, { FC, ReactNode } from 'react';
import { useMousedownContext } from '@/Hooks/useMousedownContext';
import { useMatrixContext } from '@/Hooks/useMatrixContext';
import { sxButton, yatra } from '@/Types';

// If loading a variable font, you don't need to specify the font weight

export const Matrix: FC = () => {
    const mouseDown = useMousedownContext();
    const Matrix = useMatrixContext();
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
            onContextMenu={(e) => e.preventDefault()}
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
                    background: '#111111ff',
                    padding: '1rem',
                }}
            >
                {Matrix.Matrix}
            </Grid>
            <Grid
                item
                sx={{
                    marginTop: '1rem',
                    fontFamily: yatra.style.fontFamily,
                }}
            >
                <Button
                    sx={{ ...sxButton, marginRight: '1rem' }}
                    disableRipple
                    onClick={Matrix.newMatrix}
                >
                    New Seed
                </Button>
                <Button sx={sxButton} disableRipple onClick={Matrix.resetMatrix}>
                    Reset
                </Button>
            </Grid>
        </Grid>
    );
};
