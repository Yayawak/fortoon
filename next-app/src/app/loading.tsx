'use client'
import React, { useState, useEffect } from 'react';

const Loading = () => {
  const [progress, setProgress] = useState(0);
  const [color, setColor] = useState('#3498db'); // Start with blue

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prevProgress + 1;
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Change color based on progress
    if (progress < 33) {
      setColor('#3498db'); // Blue
    } else if (progress < 66) {
      setColor('#e67e22'); // Orange
    } else {
      setColor('#2ecc71'); // Green
    }
  }, [progress]);

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <div 
        className="h-1 transition-all duration-300 ease-out"
        style={{ 
          width: `${progress}%`,
          backgroundColor: color
        }}
      />
      <div className="flex justify-center items-center h-screen">
        <div className="text-2xl font-bold animate-bounce">
          Loading...
        </div>
      </div>
    </div>
  );
};

export default Loading;