"use client";
import React, { useState, useRef, FormEvent } from "react";
import { ReactSketchCanvas, ReactSketchCanvasRef } from "react-sketch-canvas";
import { useMutation } from "convex/react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Image from "next/image";
const styles: React.CSSProperties = {
  border: "0.0625rem solid #9c9c9c",
  borderRadius: "0.25rem",
  backgroundColor: "black",
};

const CanvasComponent: React.FC = () => {
  const [inputSketch, setInputSketch] = useState<string>("");
  const [isErasing, setIsErasing] = useState(false);
  const canvasRef = useRef<ReactSketchCanvasRef>(null);
  const [baseImage, setBaseImage] = useState<string>("");

  // Creating data in the convex table
  const createSketch = useMutation(api.createSketch.sketchTable);
  // Getting data in the convex table
  const getDataConvex = useQuery(api.createSketch.getSketchData);
  const toggleEraser = () => {
    setIsErasing(!isErasing);
    canvasRef.current?.eraseMode(!isErasing);
  };

  const clearCanvas = () => {
    canvasRef.current?.clearCanvas();
  };

  const undoLast = () => {
    canvasRef.current?.undo();
  };

  const exportImage = async () => {
    if (canvasRef.current) {
      const imageData = await canvasRef.current.exportImage("png");
      // Creating a Download Link:
      const link = document.createElement("a");
      // Setting the Image Data as the Link's Href:

      link.href = imageData;
      //  Setting the Download Filenam
      link.download = "sketch.png";
      // Triggering the Download
      link.click();
    }
  };

  const exportSvg = async () => {
    if (canvasRef.current) {
      const svgData = await canvasRef.current.exportSvg();
      const link = document.createElement("a");
      link.href = `data:image/svg+xml;utf8,${encodeURIComponent(svgData)}`;
      link.download = "sketch.svg";
      link.click();
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let imageBase64: string | undefined;

    if (canvasRef.current) {
        // returns a Promise which resolves to base64 data url of the sketch.
       imageBase64 = await canvasRef.current.exportImage("png");
       // setting the base64 url
       setBaseImage(imageBase64)
    }

    if (!imageBase64) {
        console.error("No image available to submit.");
        return; // Exit the function if the image is not available
    }

    try {
        await createSketch({ text: inputSketch, image: [""] });
        setInputSketch("");
    } catch (err) {
        console.error("Error creating table:", err);
    }
};
   

  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <form onSubmit={(e) => handleSubmit(e)}>
        <div className="bg-slate-800 w-full max-w-2xl rounded-lg shadow-lg p-8">
          <label className="text-white">Write your Message</label>
          <input
            type="text"
            value={inputSketch}
            onChange={(e) => setInputSketch(e.target.value)}
            placeholder="Type your prompt here"
            className="mb-4 text-black border rounded-lg cursor-pointer w-full mt-2"
          />
          <ReactSketchCanvas
            ref={canvasRef}
            style={styles}
            width="600"
            height="400"
            strokeWidth={isErasing ? 20 : 4}
            strokeColor={isErasing ? "black" : "white"}
            canvasColor="black"
         
          />
          <div className="grid grid-cols-3 gap-2 mt-4 space-x-2">
            <button
              onClick={toggleEraser}
              className="bg-blue-500 text-white py-2 px-4 rounded"
            >
              {isErasing ? "Switch to Draw" : "Switch to Eraser"}
            </button>
            <button
              onClick={clearCanvas}
              className="bg-red-500 text-white py-2 px-4 rounded"
            >
              Clear Canvas
            </button>

            <button
              onClick={undoLast}
              className="bg-green-500 text-white py-2 px-4 rounded"
            >
              Undo
            </button>
            <button
              onClick={exportImage}
              className="bg-purple-500 text-white py-2 px-4 rounded"
            >
              Export as PNG
            </button>
            <button
              onClick={exportSvg}
              className="bg-indigo-500 text-white py-2 px-4 rounded"
            >
              Export as SVG
            </button>

            <div>
              <button
                type="submit"
                className="bg-yellow-500 text-white py-2 px-4 rounded"
              >
                Submit Image
              </button>
            </div>
          </div>
          <div className="border-t border-gray-300 pt-4 mt-4">
            <h2 className="text-xl font-bold mb-2 text-white">
              Convex Table content
            </h2>
       
            {getDataConvex?.map((data, index) => (
              <div
                key={index}
                className="w-full mb-4 p-4 bg-slate-700 rounded-lg"
              >
                <h2 className="text-white whitespace-pre-line text-base leading-relaxed">
                  {data.text}
                </h2>

                  {/* {data.images.length > 0 && data.images.map((src,) =>(
                    <Image
                    src={src}
                    alt={"images"}
                    width={250}
                    height={250}
                    />
                  ))} */}
              </div>
            
            ))}
          </div>
        </div>
      </form>
    </div>
  );
};

export default CanvasComponent;
