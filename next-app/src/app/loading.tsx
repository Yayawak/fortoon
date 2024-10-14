// 'use client';

// import React, { createContext, useContext, useState, useEffect } from 'react';
// import { usePathname, useSearchParams } from 'next/navigation';
// import LoadingBar from './LoadingBar';

// const NavigationContext = createContext({
//   isLoading: false
// });

// export function NavigationProvider({ children }: { children: React.ReactNode }) {
//   const [isLoading, setIsLoading] = useState(false);
//   const pathname = usePathname();
//   const searchParams = useSearchParams();

//   useEffect(() => {
//     setIsLoading(true);
//     const timer = setTimeout(() => {
//       setIsLoading(false);
//     }, 1000); // Minimum loading time

//     return () => clearTimeout(timer);
//   }, [pathname, searchParams]);

//   return (
//     <NavigationContext.Provider value={{ isLoading }}>
//       {isLoading && <LoadingBar />}
//       {children}
//     </NavigationContext.Provider>
//   );
// }

// export const useNavigation = () => useContext(NavigationContext);8
// loading.tsx or loading.js
import React from 'react';

const Loading = () => {
  return (
    <div>
      Loading...
    </div>
  );
};

export default Loading;
