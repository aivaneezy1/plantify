"use client";
import React, { useState, useRef, FormEvent } from "react";
import { ReactSketchCanvas, ReactSketchCanvasRef } from "react-sketch-canvas";
import { useMutation } from "convex/react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Image from "next/image";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import mime from "mime"; // Import mime package
const styles: React.CSSProperties = {
  border: "0.0625rem solid #9c9c9c",
  borderRadius: "0.25rem",
  backgroundColor: "black",
};

// Initialize S3 client
const s3 = new S3Client({
  region: process.env.NEXT_PUBLIC_AWS_S3_REGION, // Replace with your region
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_S3_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_S3_SECRET_ACCESS_KEY || "",
  },
});

const SketchComponent = () => {
  const [inputSketch, setInputSketch] = useState<string>("");
  const [isErasing, setIsErasing] = useState(false);
  const canvasRef = useRef<ReactSketchCanvasRef>(null);
  const [baseImage, setBaseImage] = useState<string>("");

  const createSketch = useMutation(api.createImage.sketchImageTable);

  const toggleEraser = () => {
    setIsErasing(!isErasing);
    canvasRef.current?.eraseMode(!isErasing);
  };

  const clearCanvas = () => {
    canvasRef.current?.clearCanvas();
  };



  const handleSubmitSketch = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let path:string = `imageSketch/${Date.now()}.png`

    if (!canvasRef.current) {
      console.error("Canvas reference is missing.");
      return;
    }

    try {
      // Returns a Promise that resolves to a base64 data URL of the sketch
      const imageBase64 = await canvasRef.current.exportImage("png");
   
      if (!imageBase64) {
        console.error("No image available to submit.");
        return; // Exit the function if the image is not available
      }

    // Convert base64 to binary data(buffer)
    const base64data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
    const imageBuffer = Buffer.from(base64data, "base64");

    // S3  upload parameters
    const uploadParams = {
      Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME,
      Key: path,
      Body: imageBuffer,
      ContentType: "image/png",
    }

    //Upload image to s3
    const data = await s3.send(new PutObjectCommand(uploadParams));
    console.log("Image successfully uploaded to S3:", data);
 
      // Send the base64 image to your createSketch function
      await createSketch({
        text: inputSketch,
        image: `https://${process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_AWS_S3_REGION}.amazonaws.com/${path}` 
      });

      // Clear the input field after successful submission
      setInputSketch("");
    } catch (err) {
      console.error("Error creating sketch:", err);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row space-y-10 md:space-y-0 md:space-x-10 p-8 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-900 rounded-lg shadow-2xl">
      <div className="w-full md:w-1/2 p-4">
        <form onSubmit={handleSubmitSketch} className="space-y-6">
          <div className="flex flex-col">
            <label className="text-white text-lg font-semibold">
              Write your Message:
            </label>
            <input
              type="text"
              value={inputSketch}
              onChange={(e) => setInputSketch(e.target.value)}
              placeholder="Type your prompt here"
              className="mb-4 text-black border border-gray-300 rounded-lg cursor-pointer w-full mt-2 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
              required
            />
            <ReactSketchCanvas
              ref={canvasRef}
              style={styles}
              width="100%"
              height="400px"
              strokeWidth={isErasing ? 20 : 4}
              strokeColor={isErasing ? "black" : "white"}
              canvasColor="black"
              className="rounded-lg shadow-md mt-4"
            />
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
              <button
                onClick={toggleEraser}
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg shadow-md transition-all duration-200"
                type="button"
              >
                {isErasing ? "Switch to Draw" : "Switch to Eraser"}
              </button>
              <button
                type="button"
                onClick={clearCanvas}
                className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg shadow-md transition-all duration-200"
              >
                Clear Canvas
              </button>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white py-4 px-8 rounded-lg mt-5 font-bold shadow-lg transition-all duration-200 w-full md:w-auto"
            >
              Generate
            </button>
          </div>
        </form>
      </div>
      <div className="flex justify-center items-center w-auto md:w-1/2">
        <Image
          src="/ai.webp"
          alt="test"
          width={500}
          height={500}
          className="rounded-lg shadow-lg transition-transform transform hover:scale-105 duration-300"
        />
      </div>
    </div>
  );
};

export default SketchComponent;
