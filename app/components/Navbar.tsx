"use client";
import Link from "next/link";
import React from "react";
import ProductComponent from "./Product";
import { useUser } from "@clerk/nextjs";
import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
const Navbar = () => {
  const { isLoaded, isSignedIn, user } = useUser();

  return (
    <div className="text-white p-4 flex justify-between items-center shadow-md cursor-pointer font-medium sticky top-0 z-50 bg-gradient-to-r from-gray-700 to-gray-900 gap-5">
      <div className=" flex  justify-center items-center mr-auto gap-5">
      {/*Logo */}
        <Link href="/">
          <div className="flex flex-row justify-between items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              className="w-8 h-8"
            >
              <path
                fill="#63E6BE"
                d="M272 96c-78.6 0-145.1 51.5-167.7 122.5c33.6-17 71.5-26.5 111.7-26.5l88 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-16 0-72 0s0 0 0 0c-16.6 0-32.7 1.9-48.3 5.4c-25.9 5.9-49.9 16.4-71.4 30.7c0 0 0 0 0 0C38.3 298.8 0 364.9 0 440l0 16c0 13.3 10.7 24 24 24s24-10.7 24-24l0-16c0-48.7 20.7-92.5 53.8-123.2C121.6 392.3 190.3 448 272 448l1 0c132.1-.7 239-130.9 239-291.4c0-42.6-7.5-83.1-21.1-119.6c-2.6-6.9-12.7-6.6-16.2-.1C455.9 72.1 418.7 96 376 96L272 96z"
              />
            </svg>

            <h2 className="font-semibold">
              Pla<span className="text-green-500">nt</span>ify
            </h2>
          </div>
        </Link>
        {/*Product Menu */}
        <ProductComponent />
      </div>

      {isSignedIn ? (
        <Link href="/dashboard" className="hover:text-blue-500">
          Dashboard
        </Link>
      ) : (
        ""
      )}

      {/*User logged In */}
      {isSignedIn ? (
        <UserButton />
      ) : (
        <Link href="/sign-in">
          <button className="bg-purple-500 text-white py-2 px-8 rounded-full hover:bg-purple-600 transition duration-300">
            Login
          </button>
        </Link>
      )}
    </div>
  );
};

export default Navbar;
