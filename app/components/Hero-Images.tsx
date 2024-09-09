import React from "react";
import Link from "next/link";
import Image from "next/image";
const HeroImagesComponent = () => {
  return (
    <div>
      <div className="mt-20 flex flex-col md:flex-row justify-center items-center gap-5 p-6">
        <div className="text-center ">
          <h2 className="text-4xl font-semibold mb-4 ">
            Generate images from a text prompt
          </h2>
          <p className="text-lg mb-6">
            Submit a text prompt and see it transformed into a stunning image.
          </p>
          <Link href="/generatePrompt">
            <button className="bg-blue-500 text-white font-bold py-2 px-12 rounded hover:bg-blue-600 transition duration-300">
              Generate
            </button>
          </Link>
        </div>
        <div className="flex justify-center items-center">
          <Image
            src="/gif2.gif"
            alt="First Image"
            width={800}
            height={800}
            className="w-full h-auto  rounded-lg shadow-lg transition transform hover:scale-105 duration-300 cursor-pointer"
            unoptimized
          />
        </div>
      </div>

      {/*Desktop mode */}
      <div className="hidden md:flex mt-20  flex-col md:flex-row justify-center items-center gap-5 p-6">
        <div className="flex justify-center items-center ">
          <Image
         src="/gif3.gif"
            alt="First Image"
            width={500}
            height={500}
            className="w-full h-auto rounded-lg shadow-lg transition transform hover:scale-105 duration-300 cursor-pointer"
            unoptimized
          />
        </div>
        <div className=" text-center ">
          <h2 className="text-4xl font-semibold mb-4">
            Generate images from a sketch
          </h2>
          <p className="text-lg mb-6">
            Upload a sketch and watch it come to life as a fully rendered image.
          </p>
          <Link href="/generateSketch">
            <button className="bg-purple-500 text-white font-bold py-2 px-8 rounded hover:bg-purple-600 ">
              Generate
            </button>
          </Link>
        </div>
      </div>

      {/*Mobile mode */}
      <div className="flex md:hidden mt-20  flex-col md:flex-row justify-center items-center gap-5 p-6">
        <div className=" text-center ">
          <h2 className="text-4xl font-semibold mb-4">
            Generate images from a sketch
          </h2>
          <p className="text-lg mb-6">
            Upload a sketch and watch it come to life as a fully rendered image.
          </p>
          <Link href="/generateSketch">
            <button className="bg-purple-500 text-white font-bold py-2 px-8 rounded hover:bg-purple-600 ">
              Generate
            </button>
          </Link>
        </div>

        <div className="flex justify-center items-center ">
          <Image
            src="/gif3.gif"
            alt="First Image"
            width={500}
            height={500}
            className="w-full h-auto rounded-lg shadow-lg transition transform hover:scale-105 duration-300 cursor-pointer"
            unoptimized
          />
        </div>
      </div>
    </div>
  );
};

export default HeroImagesComponent;
