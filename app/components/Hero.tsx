"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Image from "next/image";

const Hero = () => {
  const getImages = useQuery(api.createSketch.getSketchData);

  return (
    <div className="py-16 px-8 text-center flex flex-col justify-center items-center">
      <h2 className="text-5xl font-bold text-purple-500 mb-4">Plantify Ai</h2>
      <p className="text-2xl text-white mb-8">
        Generate an Image through a text or sketch
      </p>
   
   
      <div className="mt-8 grid gap-4 md:grid-cols-4  grid-cols-3 " >
        {getImages ? (
          getImages.map((data, index) =>
            data.images.map((src, i) => (
              <div key={`${index}-${i}`} className="w-full">
                {src ? (
                  <Image
                    src={src}
                    alt={`Image ${i}`}
                    width={500}
                    height={500}
                    className="w-full h-auto object-cover transition transform hover:scale-105 duration-300 rounded-md"
                  />
                ) : (
                  <h2>Image is Loading...</h2>
                )}
              </div>
            ))
          )
        ) : (
          <h2>Loading...</h2>
        )}
      </div>

      <div className="mt-20 flex flex-col md:flex-row justify-center items-center gap-5 p-6">
        <div className="text-center ">
          <h2 className="text-4xl font-semibold mb-4">
            Generate images from a text prompt
          </h2>
          <p className="text-lg mb-6">
            Provide a prompt and watch your prompt turned into an image
          </p>
         <Link href="/generatePrompt">
          <button className="bg-purple-500 text-white font-bold py-2 px-12 rounded hover:bg-purple-600 transition duration-300">
          Generate
        </button>
         </Link>
        </div>
        <div className="flex justify-center items-center">
         <Link href="/generatePrompt">
          <Image
            src="/ai.webp"
            alt="First Image"
            width={500}
            height={500}
            className="w-full h-auto object-cover rounded-lg shadow-lg transition transform hover:scale-105 duration-300 cursor-pointer"
          />
         </Link>
        </div>
      </div>

      <div className="mt-20 flex flex-col md:flex-row justify-center items-center gap-5 p-6">
        <div className="flex justify-center items-center ">
         <Link href="/generateSketch">
          <Image
            src="/medium.webp"
            alt="First Image"
            width={500}
            height={500}
            className="w-full h-auto object-cover rounded-lg shadow-lg transition transform hover:scale-105 duration-300 cursor-pointer" 
          />
         </Link>
        </div>
        <div className=" text-center ">
          <h2 className="text-4xl font-semibold mb-4">
            Generate images from a sketch
          </h2>
          <p className="text-lg mb-6">
            Provide a sketch, and watch the sketch turned into an image
          </p>
          <Link href="/generateSketch">
          <button className="bg-blue-500 text-white font-bold py-2 px-8 rounded hover:bg-blue-600 ">
            Generate
          </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Hero;
