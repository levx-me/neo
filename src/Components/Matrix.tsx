'use client';
import { Button, Grid } from '@mui/material';
import React, { FC, ReactNode } from 'react';
import { useMousedownContext } from '@/Hooks/useMousedownContext';
import { useMatrixContext } from '@/Hooks/useMatrixContext';

export const Matrix: FC = () => {
    const mouseDown = useMousedownContext();
    const Matrix = useMatrixContext();
    return (
        <Grid
            container
            direction={'column'}
            justifyContent={'center'}
            alignItems={'center'}
            sx={{
                height: '100vh',
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
            <Grid item>{Matrix.Matrix}</Grid>
            <Grid
                item
                sx={{
                    marginTop: '1rem',
                }}
            >
                <Button onClick={Matrix.resetMatrix}>Reset</Button>
            </Grid>
        </Grid>
    );
};
