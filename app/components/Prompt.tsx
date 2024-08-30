"use client";
import React, { useState, useRef, FormEvent } from "react";
import { useMutation } from "convex/react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import Image from "next/image";
const PromptComponent = () => {
  const [inputPrompt, setInputPrompt] = useState<string>("");
  const [sketchId, setSketchId] = useState<string>("");
  const [inputNumber, setInputNumber] = useState<string>("");

  // Creating data in the convex table
  const createSketch = useMutation(api.createSketch.sketchTable);
  // Getting data in the convex table
  // Query to get the image data using the sketchId
  const getImageData = useQuery(api.createSketch.getImage, {
    sketchId: sketchId || "",
  });

 // const getImageData = useQuery(api.createSketch.getSketchData, {});

  const handleDownload = async (imageUrl: string) => {
    try {
      // Fetch the image as a Blob
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      // Create a temporary link element
      const link = document.createElement("a");
      link.href = url;
      link.download = "sketch.png"; // Specify the download filename

      // Append link to body (required for Firefox)
      document.body.appendChild(link);
      link.click();

      // Clean up
      document.body.removeChild(link);
      URL.revokeObjectURL(url); // Free up memory
    } catch (error) {
      console.error("Error downloading image:", error);
    }
  };

  const handleSubmitPrompt = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // Create the sketch and get the new sketch ID
      const newSketch: Id<"sketch"> = await createSketch({
        text: inputPrompt,
        image: [""],
        numberOfSamples: parseInt(inputNumber),
      });
      setSketchId(newSketch);

      setInputPrompt("");
      setInputNumber("");
    } catch (err) {
      console.error("Error creating sketch:", err);
    }
  };

  return (
   <div className="flex flex-col md:flex-row mt-20">
  <div className="md:w-1/2 p-4">
    <form onSubmit={handleSubmitPrompt}>
      <div className="flex flex-col gap-4">
        <label className="text-white text-lg font-semibold">
          Write your Message:
        </label>
        <input
          type="text"
          value={inputPrompt}
          onChange={(e) => setInputPrompt(e.target.value)}
          placeholder="Type your prompt here"
          className="text-black border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
          required
        />

        <select
          value={inputNumber}
          onChange={(e) => setInputNumber(e.target.value)}
          className="text-black border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
          required
        >
          <option value="256">1 Photo</option>
          <option value="2">2 Photos</option>
          <option value="3">3 Photos</option>
          <option value="4">4 Photos</option>
        </select>

        <button
          type="submit"
          className="bg-blue-500 text-white py-3 px-6 rounded-lg font-bold hover:bg-blue-600 transition duration-300"
        >
          Generate
        </button>
      </div>
    </form>
  </div>

  <div className="w-full md:w-1/2 p-4 flex flex-col">
    {getImageData ? (
      getImageData.map((data, index) => (
        <div key={index} className="flex-1 mb-6">
          <h2 className="text-3xl font-bold text-center mb-4">
            {data.text}
          </h2>
          <div className="flex flex-wrap gap-6 justify-center">
            {data.images.length > 0 ? (
              data.images.map((src, indx) => (
                <div key={indx} className="relative mb-6">
                  {src ? (
                    <div>
                      <Image
                        src={src}
                        alt="Image"
                        width={250}
                        height={250}
                        className="border border-gray-300 rounded-lg shadow-lg object-cover"
                      />
                      <div className="flex flex-row justify-center items-center mt-2 gap-2 bg-blue-500 px-8 py-4 rounded-lg font-semibold text-center hover:bg-blue-600 cursor-pointer">
                        <div>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 640 512"
                            className="w-6 h-6"
                          >
                            <path
                              fill="#ffffff"
                              d="M144 480C64.5 480 0 415.5 0 336c0-62.8 40.2-116.2 96.2-135.9c-.1-2.7-.2-5.4-.2-8.1c0-88.4 71.6-160 160-160c59.3 0 111 32.2 138.7 80.2C409.9 102 428.3 96 448 96c53 0 96 43 96 96c0 12.2-2.3 23.8-6.4 34.6C596 238.4 640 290.1 640 352c0 70.7-57.3 128-128 128l-368 0zm79-167l80 80c9.4 9.4 24.6 9.4 33.9 0l80-80c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-39 39L344 184c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 134.1-39-39c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9z"
                            />
                          </svg>
                        </div>
                        <div>
                          <button onClick={() => handleDownload(src)}>
                            Download
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <h2 className="text-center text-gray-500">
                      Loading ...
                    </h2>
                  )}
                </div>
              ))
            ) : (
              <h2 className="text-center text-gray-500">Loading....</h2>
            )}
          </div>
        </div>
      ))
    ) : (
      <h2 className="text-center text-gray-500">Loading....</h2>
    )}
  </div>
</div>
  );
};

export default PromptComponent;
