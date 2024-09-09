"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Image from "next/image";
import Loading from "../utils/Loading";
import FrequentQuestionComponent from "./Frequent-Question";
import HeroImagesComponent from "./Hero-Images";
interface ImageData {
  key: string;
  url: string;
}
const Hero = () => {
  const [dataImages, setDataImages] = useState<ImageData[]>([]);

  useEffect(() => {
    const handleGetData = async () => {
      try {
        const res = await fetch("api/s3-getImages");
        if (res.ok) {
          const data = await res.json();

          setDataImages(data);
        }
      } catch (err) {
        throw new Error(`message: ${err}`);
      }
    };
    handleGetData();
  }, []);
  return (
    <div className="py-16 px-8 text-center flex flex-col justify-center items-center">
      <h2 className="text-6xl font-extrabold text-white mb-6 drop-shadow-md">
        Pla<span className="text-green-500">nt</span>ify AI
      </h2>
      <p className="text-2xl text-gray-100 mb-10 max-w-2xl leading-relaxed">
        Generate an Image through a text or sketch with the power of AI.
      </p>
   

      <div className="mt-8 grid gap-4 md:grid-cols-4  grid-cols-3 ">
        {dataImages.length > 0 ? (
          dataImages.map((src, idx) => (
            <div key={idx}>
              <Image
                src={src.url}
                alt={`Image ${idx}`}
                width={500}
                height={500}
                className="w-full h-auto object-cover transition transform hover:scale-105 duration-300 rounded-md"
              />
            </div>
          ))
        ) : (
          <div className="flex justify-center flex-col mx-auto items-center text-white text-center">
            <Loading />
            <h2>Loading...</h2>
          </div>
        )}
      </div>

      {/*Hero images */}
      <HeroImagesComponent />

      {/* Frequently Asked Questions */}
      <FrequentQuestionComponent />
    </div>
  );
};

export default Hero;
