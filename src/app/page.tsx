'use client';
import { Matrix } from '@/Components/Matrix';
export default function Home() {
    return (
        <main
            style={{
                background: 'url("/bg.png")',
                backgroundPosition: 'bottom right',
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
            }}
        >
            <Matrix></Matrix>
        </main>
    );
}
