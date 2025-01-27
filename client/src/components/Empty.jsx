import React from 'react';

const Empty = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <img 
        src="/empty.png" 
        alt="Empty" 
        className="w-64 h-auto" 
      />
      <p className="text-gray-500 mt-4">No data available</p>
    </div>
  );
}

export default Empty;
