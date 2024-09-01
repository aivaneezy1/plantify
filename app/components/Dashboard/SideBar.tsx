"use client";
import React, { useState, useContext } from "react";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { DataContext } from "@/app/Context/Provider";

const Sidebar = () => {
  const { selectedItem, setSelectedItem } = useContext(DataContext);
  const [open, setOpen] = useState(false);

  const handleItemClick = (item: string) => {
    setSelectedItem(item); // Update active item on click
    setOpen(false); // Close the drawer after selecting an item
  };

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const renderSidebarContent = () => (
    <>
      <div
        className={`p-4 rounded-lg cursor-pointer ${selectedItem === "DashBoard" ? "bg-gray-500 font-bold" : "hover:bg-gray-400 hover:font-bold"}`}
        onClick={() => handleItemClick("DashBoard")}
      >
        Dashboard
      </div>
      <div
        className={`p-4 rounded-lg cursor-pointer ${selectedItem === "Requests" ? "bg-gray-500 font-bold" : "hover:bg-gray-400 hover:font-bold"}`}
        onClick={() => handleItemClick("Requests")}
      >
        Recent Requests
      </div>
      <div
        className={`p-4 rounded-lg cursor-pointer ${selectedItem === "Billing" ? "bg-gray-500 font-bold" : "hover:bg-gray-400 hover:font-bold"}`}
        onClick={() => handleItemClick("Billing")}
      >
        Billing
      </div>
      <div
        className={`p-4 rounded-lg cursor-pointer ${selectedItem === "Settings" ? "bg-gray-500 font-bold" : "hover:bg-gray-400 hover:font-bold"}`}
        onClick={() => handleItemClick("Settings")}
      >
        Settings
      </div>
    </>
  );

  const renderBuyButton = () =>{
    return(
          <div className="absolute bottom-0 w-full bg-[#434C5E] p-8 rounded-lg">
              <h2 className="text-center mb-2 font-semibold">900/1000 Bits</h2>
              <div className="flex flex-row justify-between">
                <div className="w-full">
                  <button className="flex items-center justify-center w-full gap-2 p-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600">
                    Buy bits
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 384 512"
                      className="w-4 h-4"
                    >
                      <path
                        fill="#ffffff"
                        d="M0 256L28.5 28c2-16 15.6-28 31.8-28H228.9c15 0 27.1 12.1 27.1 27.1c0 3.2-.6 6.5-1.7 9.5L208 160H347.3c20.2 0 36.7 16.4 36.7 36.7c0 7.4-2.2 14.6-6.4 20.7l-192.2 281c-5.9 8.6-15.6 13.7-25.9 13.7h-2.9c-15.7 0-28.5-12.8-28.5-28.5c0-2.3 .3-4.6 .9-6.9L176 288H32c-17.7 0-32-14.3-32-32z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
    )
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:flex-col gap-5 ml-5 mt-10 h-full relative">
        {renderSidebarContent()}
        <div className="mt-auto bg-[#434C5E] p-8 rounded-lg e">
          <h2 className="text-center mb-2 font-semibold">900/1000 Bits</h2>
          <div className="flex flex-row justify-between">
            <div className="w-full">
              <button className="flex items-center justify-center w-full gap-2 p-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600">
                Buy bits
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 384 512"
                  className="w-4 h-4"
                >
                  <path
                    fill="#ffffff"
                    d="M0 256L28.5 28c2-16 15.6-28 31.8-28H228.9c15 0 27.1 12.1 27.1 27.1c0 3.2-.6 6.5-1.7 9.5L208 160H347.3c20.2 0 36.7 16.4 36.7 36.7c0 7.4-2.2 14.6-6.4 20.7l-192.2 281c-5.9 8.6-15.6 13.7-25.9 13.7h-2.9c-15.7 0-28.5-12.8-28.5-28.5c0-2.3 .3-4.6 .9-6.9L176 288H32c-17.7 0-32-14.3-32-32z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div className="md:hidden mt-10 relative">
        <Button onClick={toggleDrawer(true)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512"
            className="w-6 h-6"
          >
            <path
              fill="#ffffff"
              d="M0 96C0 78.3 14.3 64 32 64l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 128C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 288c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32L32 448c-17.7 0-32-14.3-32-32s14.3-32 32-32l384 0c17.7 0 32 14.3 32 32z"
            />
          </svg>
        </Button>
        <Drawer open={open} onClose={toggleDrawer(false)}>
          <Box
            className="w-64 bg-gray-800 text-white h-full"
            sx={{ width: 250 }}
            role="presentation"
            onClick={toggleDrawer(false)}
            onKeyDown={toggleDrawer(false)}
          >
            {renderSidebarContent()}

            {/*Buy button */}
            {renderBuyButton()}
          </Box>
        </Drawer>
      </div>
    </>
  );
};

export default Sidebar;
