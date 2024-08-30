"use client";
import React, { useState, useRef, FormEvent } from "react";
import { ReactSketchCanvas, ReactSketchCanvasRef } from "react-sketch-canvas";
import { useMutation } from "convex/react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Image from "next/image";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

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
  const [isErasing, setIsErasing] = useState<Boolean>(false);
  const [imageUrl, setImageUrl] = useState<string>("");
  const canvasRef = useRef<ReactSketchCanvasRef>(null);

  // Creating table
  const createSketch = useMutation(api.createImage.sketchImageTable);

  // Getting data from the table
  const getAllImages = useQuery(api.createImage.getAllImage);

  const toggleEraser = () => {
    setIsErasing(!isErasing);
    canvasRef.current?.eraseMode(!isErasing);
  };

  const clearCanvas = () => {
    canvasRef.current?.clearCanvas();
  };

  const handleDownload = (imageUrl: string) => {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = "sketch.png";
    link.click();
  };

  const handleSubmitSketch = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let path: string = `imageSketch/${Date.now()}.png`;

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
      // The binary data (now a Buffer) is wrapped in an array because the Blob constructor expects an iterable (like an array) containing the data parts.
      const imageBlob = new Blob([Buffer.from(base64data, "base64")], {
        type: "image/png",
      });

      // S3  upload parameters
      const uploadParams = {
        Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME,
        Key: path,
        Body: imageBlob,
        ContentType: "image/png",
      };

      //Upload image to s3
      await s3.send(new PutObjectCommand(uploadParams));

      // Construct the URL to access the image
      const imageUrl = `https://${process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_AWS_S3_REGION}.amazonaws.com/${path}`;

      //Send the promp text and image  url to the CreateImage table
      await createSketch({
        text: inputSketch,
        image: imageUrl,
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
        <form  className="space-y-6">
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
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 space-y-6 ">
        {getAllImages ? (
          getAllImages.map((data, idx) => (
            <>
         
              <div
                key={idx}
                className="flex flex-col gap-2 justify-center items-center w-full"
              >
                <h2 className="text-2xl font-bold ">{data.text}</h2>
                <Image
                  src={data.image}
                  alt={`Image ${idx}`}
                  width={500}
                  height={500}
                  className="rounded-lg shadow-lg transition transform hover:scale-105 duration-300 "
                />
                <div className=" flex flex-row justify-center items-center gap-2 bg-blue-500 px-8 py-4 rounded-lg w-1/2 font-semibold text-center mt-2 hover:bg-blue-600 cursor-pointer">
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
                  <div key={idx}>
                    <button 
                      onClick={() => handleDownload(data.image)}
                    className="">Download</button>
                  </div>
                </div>
              </div>
            </>
          ))
        ) : (
          <h2 className="flex justify-center items-center">Loading...</h2>
        )}
      </div>
    </div>
  );
};

export default SketchComponent;