"use client";
import React, { useState, useRef, FormEvent } from "react";
import { useMutation } from "convex/react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import Image from "next/image";
const PromptComponent = () => {
  const [inputSketch, setInputSketch] = useState<string>("");
  const [sketchId, setSketchId] = useState<string>("");
  // Creating data in the convex table
  const createSketch = useMutation(api.createSketch.sketchTable);
  // Getting data in the convex table
  // Query to get the image data using the sketchId
  const getImageData = useQuery(api.createSketch.getImage, {
    sketchId: sketchId || "",
  });

  const handleSubmitPrompt = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // Create the sketch and get the new sketch ID
      const newSketch: Id<"sketch"> = await createSketch({
        text: inputSketch,
        image: [""],
      });
      setSketchId(newSketch);

      setInputSketch("");
    } catch (err) {
      console.error("Error creating sketch:", err);
    }
  };
  console.log("res", inputSketch);
  console.log("res image", getImageData);
  return (
    <div className="flex flex-col md:flex-row mt-20 ">
      <div className="w-full md:w-1/2 p-4 ">
        <form onSubmit={handleSubmitPrompt}>
          <div className="flex flex-col gap-2">
            <label className="text-white">Write your Message:</label>
            <input
              type="text"
              value={inputSketch}
              onChange={(e) => setInputSketch(e.target.value)}
              placeholder="Type your prompt here"
              className="mb-4 text-black border border-gray-300 rounded-lg cursor-pointer w-1/2 mt-2 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
            />
            <div>
              <button
                type="submit"
                className="bg-blue-500 text-white py-2 px-4 rounded"
              >
                Submit Image
              </button>
            </div>
          </div>
        </form>
      </div>

      <div className="w-full md:w-1/2 p-4 flex  flex-wrap justify-center">
        {getImageData &&
          getImageData.map((data, index) => (
            <>
              <h2 className="text-4xl font-bold">{data.text}</h2>
              <div key={index} className="p-2 flex flex-col md:flex-row gap-5 mt-2">
                {data.images.length > 0 &&
                  data.images.map((src, indx) => (
                    src ? (
                           <Image
                      key={indx}
                      src={src}
                      alt={"images"}
                      width={250}
                      height={250}
                      className="border rounded-lg"
                    />
                    ) : <h2>Loading ...</h2>
                  ))}
              </div>
            </>
          ))}
      </div>
    </div>
  );
};

export default PromptComponent;
