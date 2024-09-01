"use client"
import React, { useState, useContext } from 'react';

import { DataContext } from '@/app/Context/Provider';
const Sidebar = () => {
  const {selectedItem, setSelectedItem} = useContext(DataContext);
  const handleItemClick = (item: string) => {
    setSelectedItem(item); // Update active item on click
  };

  

  
  return (
    <div className="hidden md:flex md:flex-col gap-5 ml-5 mt-10 h-full">
      <div
        className={`p-4 rounded-lg cursor-pointer ${selectedItem === 'DashBoard' ? 'bg-gray-500 font-bold' : 'hover:bg-gray-400 hover:font-bold'}`}
        onClick={() => handleItemClick('DashBoard')}
      >
       Dashboard
      </div>
      <div
        className={`p-4 rounded-lg cursor-pointer ${selectedItem === 'Billing' ? 'bg-gray-500 font-bold' : 'hover:bg-gray-400 hover:font-bold'}`}
        onClick={() => handleItemClick('Billing')}
      >
        Billing
      </div>
      <div
        className={`p-4 rounded-lg cursor-pointer ${selectedItem === 'Settings' ? 'bg-gray-500 font-bold' : 'hover:bg-gray-400 hover:font-bold'}`}
        onClick={() => handleItemClick('Settings')}
      >
        Settings
      </div>
    </div>
  );
};

export default Sidebar;
