import Link from "next/link";
import React from "react";
import ProductComponent from "./Product";
const Navbar = () => {
  return (
    <div className="text-white p-4 flex justify-between items-center shadow-md cursor-pointer font-medium sticky top-0 z-50 bg-gradient-to-r from-gray-700 to-gray-900">
      <div className=" flex justify-center items-center mr-auto gap-10">
        <Link className="text-center" href="/">
          Logo
        </Link>
        <Link href="/dashboard" className="hover:text-blue-500">
        Dashboard 
        </Link>
        {/*Product Menu */}
        <ProductComponent />
      </div>
      <button className="bg-purple-500 text-white py-2 px-8 rounded-full hover:bg-purple-600 transition duration-300">
        Login
      </button>
    </div>
  );
};

export default Navbar;
