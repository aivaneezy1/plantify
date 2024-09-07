"use client";
import React, { ChangeEvent, useState } from "react";
import { useUser } from "@clerk/nextjs";

const Testpage = () => {
  const [inputBits, setInputBits] = useState<string>("");
  const { isLoaded, isSignedIn, user } = useUser();
  const [checkoutSessionId, setCheckoutSessionId] = useState<string | null>(null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setInputBits(value);
    }
  };

  const calculateBits = (e: number) => {
    const total = e * 100;
    return total;
  };

  const totalBits = inputBits ? calculateBits(parseInt(inputBits)) : 0;


  const handleCheckout = async () => {
    if (!inputBits) return;

    const totalBits = parseInt(inputBits);
  
    console.log("total", totalBits)
    
    try {
      const response = await fetch("/api/stripe-test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount: totalBits }),
      });

      const data = await response.json();
      setCheckoutSessionId(data.sessionId);

      // Redirect to Stripe Checkout
      if (data.sessionId) {
        window.location.href = `https://checkout.stripe.com/c/pay/${data.sessionId}`;
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
    }
  };
  console.log("sessiondi", checkoutSessionId)
  return (
    <div className="flex flex-col gap-5 justify-center items-center h-screen mx-auto">
      <h2 className="bg-gray-500 p-8 rounded-lg">Stripe tests</h2>
      <div className="relative mt-2 ">
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
        onClick={handleCheckout}
        className="bg-blue-500 p-4 hover:bg-blue-600 rounded-lg"
      >
        Buy Bits
      </button>
    </div>
  );
};

export default Testpage;
