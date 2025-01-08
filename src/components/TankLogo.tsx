import React from 'react';

export const TankLogo = () => {
  return (
    <div className="flex items-center gap-4">
      {/* Red Jeep */}
      <div className="w-12 h-8">
        <div className="relative w-full h-full">
          {/* Main Body */}
          <div className="absolute inset-0 bg-red-600 border-2 border-black">
            {/* Hood */}
            <div className="absolute inset-x-2 -top-2 h-3 bg-red-600 border border-black" />
            {/* Trunk */}
            <div className="absolute inset-x-2 -bottom-2 h-3 bg-red-600 border border-black" />
            {/* Roof */}
            <div className="absolute inset-x-3 inset-y-1 bg-gray-800 border border-black" />
            {/* Windows */}
            <div className="absolute -left-1 inset-y-2 w-2 bg-blue-300 border-y border-black" />
            <div className="absolute -right-1 inset-y-2 w-2 bg-blue-300 border-y border-black" />
          </div>
          {/* Wheels */}
          <div className="absolute -left-1 -top-1 w-3 h-3 bg-gray-900 rounded-full border border-black" />
          <div className="absolute -right-1 -top-1 w-3 h-3 bg-gray-900 rounded-full border border-black" />
          <div className="absolute -left-1 -bottom-1 w-3 h-3 bg-gray-900 rounded-full border border-black" />
          <div className="absolute -right-1 -bottom-1 w-3 h-3 bg-gray-900 rounded-full border border-black" />
        </div>
      </div>
      
      {/* Blue Jeep */}
      <div className="w-12 h-8">
        <div className="relative w-full h-full">
          {/* Main Body */}
          <div className="absolute inset-0 bg-blue-600 border-2 border-black">
            {/* Hood */}
            <div className="absolute inset-x-2 -top-2 h-3 bg-blue-600 border border-black" />
            {/* Trunk */}
            <div className="absolute inset-x-2 -bottom-2 h-3 bg-blue-600 border border-black" />
            {/* Roof */}
            <div className="absolute inset-x-3 inset-y-1 bg-gray-800 border border-black" />
            {/* Windows */}
            <div className="absolute -left-1 inset-y-2 w-2 bg-blue-300 border-y border-black" />
            <div className="absolute -right-1 inset-y-2 w-2 bg-blue-300 border-y border-black" />
          </div>
          {/* Wheels */}
          <div className="absolute -left-1 -top-1 w-3 h-3 bg-gray-900 rounded-full border border-black" />
          <div className="absolute -right-1 -top-1 w-3 h-3 bg-gray-900 rounded-full border border-black" />
          <div className="absolute -left-1 -bottom-1 w-3 h-3 bg-gray-900 rounded-full border border-black" />
          <div className="absolute -right-1 -bottom-1 w-3 h-3 bg-gray-900 rounded-full border border-black" />
        </div>
      </div>
    </div>
  );
};