"use client";
import React, { useState, ChangeEvent } from "react";
import {
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
} from "@mui/material";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import Router, { useRouter } from "next/navigation";

const BillingComponent = () => {
  const [inputBits, setInputBits] = useState<string>("");
  const router = useRouter();
  const getUserData = useQuery(api.createUser.currentUser, {});
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only numeric values
    // return true else false
    if (/^[1-9]\d*$/.test(value) || value === "") {
      setInputBits(value);
    }
  };

  const calculateBits = (e: number) => {
    // 1 euro = 100 bits
    const total = e * 50;
    return total;
  };
  // Convert inputBits to a number only if it has a valid value
  const totalBits = inputBits ? calculateBits(parseInt(inputBits)) : 0;

  // Buy bits logic
  const buyBits = useAction(api.stripe.pay);
 
  const handleBuyBits = async () => {
    // getting the session URL for the Checkout.
    const url = await buyBits({
      amount: parseInt(inputBits),
    });
    if (!url) {
      return;
    }
    router.push(url);
  };
  console.log(inputBits);
  return (
    <div className="flex flex-grow-0 justify-center items-center text-2xl w-full mt-20 sm:ml-10"> 
      {/*Container for both side   */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
           {/*Left side dev */}
        <div className="bg-[#434C5E] text-white p-8 rounded-lg max-h-[400px]  flex-grow-0">
          <h2>Bits</h2>
          <hr className="my-4 border-white" />{" "}
          {/* Border at bottom of Credits */}
          <h2 className="font-bold text-3xl">{getUserData?.apiCallRemaining}</h2>
          <hr className="mt-4 border-white" /> {/* Border at bottom of 800 */}
          <h2 className="mt-4">Purchase bits to generate images</h2>
          <div className="relative mt-2 w-full">
            <label
              htmlFor="custom-input"
              className="absolute -top-2 left-2 bg-gray-700 px-1 text-white text-sm"
            >
              Amount
            </label>
            <div className="flex items-center bg-gray-700 rounded-lg border border-white p-4">
              <span className="text-white">$</span>
              <input
                id="custom-input"
                type="text"
                className="bg-transparent text-white w-full ml-2 outline-none"
                value={inputBits}
                onChange={(e) => handleInputChange(e)}
              />
            </div>
            <h2 className="text-right">{totalBits} bits</h2>
          </div>
          <button
            onClick={handleBuyBits}
            className="mt-4 w-full p-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600"
          >
            Buy
          </button>
        </div>

         {/*right side dev */}
        <div className="bg-[#434C5E] text-white p-8 rounded-lg mb-5">
          <h2>Payments</h2>
          <hr className="my-4 border-white" />{" "}
          <div className="flex flex-row justify-between items-center ">
            <div className="flex flex-col gap-5">
              <h2>Date</h2>
              {getUserData?.transactionsTimeStamp.map((item, indx) => (
                <div key={indx}>
                  <span className="text-gray-300">{item}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-5">
              <h2>Bits</h2>
              {getUserData?.bits.map((item, indx) => (
                <div key={indx}>
                  <span className="text-gray-300">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingComponent;
