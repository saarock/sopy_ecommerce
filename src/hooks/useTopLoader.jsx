import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router';

const useTopLoader = () => {
    const [topLoaderNumber, setTopLoaderNumber] = useState(0);
    const location = useLocation();


    useEffect(() => {

        setTopLoaderNumber(prev => prev + 10000);

        function reSetTopLoaderNumber() {
            setTopLoaderNumber(0);
        }
        const resetLoader = setTimeout(reSetTopLoaderNumber, 100);
         
        // cleanup function
        return () => {
            clearTimeout(resetLoader);
            setTopLoaderNumber(0);
        }
    }, [location.pathname]);

    return { topLoaderNumber }
}

export default useTopLoader