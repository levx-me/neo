import { MatrixContext } from '@/Context/MatrixContext';
import { useContext } from 'react';
export const useMatrixContext = () => {
    return useContext(MatrixContext);
};
