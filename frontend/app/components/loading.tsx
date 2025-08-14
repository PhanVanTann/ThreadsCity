import React ,{useState} from 'react';

import Home from '~/routes/home';
export default function DashBoard() {
  const [isLoading, setIsLoading] = useState(false)
 
  return (
    <>
    {
        isLoading ? (
            <div>...</div>

        ) : (
            <Home/>
        )
    }
    </>
    // <div className="w-[700px] flex flex-col items-center mt-5 h-screen bg-gray-100 dark:bg-[#000] ">
        
    // </div>
  );
}
