"use client";
import React, {
  useState,
  useRef,
  FormEvent,
  useEffect,
  useContext,
} from "react";
import { ReactSketchCanvas, ReactSketchCanvasRef } from "react-sketch-canvas";
import { useMutation } from "convex/react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Image from "next/image";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import Loading from "../utils/Loading";
import { Id } from "@/convex/_generated/dataModel";
import { useUser } from "@clerk/nextjs";
import { DataContext } from "../Context/Provider";
import AlertApiCallComponent from "./Alert/AlertApiCall";
const styles: React.CSSProperties = {
  border: "0.0625rem solid #9c9c9c",
  borderRadius: "0.25rem",
  backgroundColor: "black",
};

// Initialize S3 client
export const s3AwsClient = new S3Client({
  region: "eu-north-1", // Replace with your region
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_S3_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_S3_SECRET_ACCESS_KEY || "",
  },
});

const SketchComponent = () => {
  const [inputSketch, setInputSketch] = useState<string>("");
  const [isErasing, setIsErasing] = useState<Boolean>(false);
  const [sketchId, setSketchId] = useState<string>("");
  const [loading, setLoading] = useState<Boolean>(false);
  const canvasRef = useRef<ReactSketchCanvasRef>(null);

  // table id store from local storage
  const [getIdLocalStorage, setGetIdLocalStorage] =
    useState<Id<"users"> | null>(null);

  // Getting the user id of the user
  const { user } = useUser();
  const id: string | undefined = user?.id || "";
  // Getting the userIdTable of the users using data context

  // Creating table
  const createSketch = useMutation(api.createImage.sketchImageTable);

  // Getting data from the table
  //const getAllImages = useQuery(api.createImage.getAllImage);

  // Getting the newly creating image
  const getImage = useQuery(api.createImage.getImage, {
    sketchId: sketchId || "",
  });

  // getting data of the current user
  const getUserData = useQuery(api.createUser.currentUser, {});

  const toggleEraser = () => {
    setIsErasing(!isErasing);
    canvasRef.current?.eraseMode(!isErasing);
  };

  const clearCanvas = () => {
    canvasRef.current?.clearCanvas();
  };

  const handleDownload = async (imageUrl: string) => {
    // Fetch the image as a Blob
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "sketch.png";
    link.click();
  };

  useEffect(() => {
    // Set loading to false if the response has a success flag or if there's no data
    if (getImage && getImage.image.length > 0) {
      setLoading(false);
    }
  }, [getImage]);

  // Getting data from local Storage
  useEffect(() => {
    const tableId = window.localStorage.getItem("tableId");
    if (tableId) {
      setGetIdLocalStorage(tableId as Id<"users">); // Type assertion
    }
  }, []);

  const handleSubmitSketch = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true); // Start loading
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
      await s3AwsClient.send(new PutObjectCommand(uploadParams));

      // Construct the URL to access the image
      const imageUrl = `https://${process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME}.s3.eu-north-1.amazonaws.com/${path}`;

      //Send the promp text and image  url to the CreateImage table
      const newlyCreatedSketch: Id<"imageSketch"> = await createSketch({
        userTableId: getIdLocalStorage!,
        userId: id,
        text: inputSketch,
        image: imageUrl,
      });
      setSketchId(newlyCreatedSketch);

      // Clear the input field after successful submission
      setInputSketch("");
    } catch (err) {
      console.error("Error creating sketch:", err);
    } finally {
    }
  };

  return (
    <div className="flex flex-col justify-start sm:flex-row space-y-10 sm:space-y-0 sm:space-x-10 p-8 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-900 rounded-lg shadow-2xl">
      <div className="w-full sm:w-1/2 p-4 bg-[#434C5E]     rounded-lg">
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
              className="text-black bg-white border border-black rounded-lg w-full p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
              required
            />
            <div
              className={` rounded-lg overflow-hidden shadow-md mt-4 ${
                isErasing ? "cursor-erase" : "cursor-draw"
              }`}
            >
              <ReactSketchCanvas
                ref={canvasRef}
                style={{
                  borderRadius: "0.375rem", // Ensures the canvas itself is rounded
                  width: "100%",
                  height: "400px",
                  border: "1px solid black",
                }}
                width="100%"
                height="400px"
                strokeWidth={isErasing ? 20 : 4}
                strokeColor={isErasing ? "white" : "black"}
                canvasColor="white"
                className=" "
              />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
              <button
                onClick={toggleEraser}
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg shadow-md transition duration-200"
                type="button"
              >
                {isErasing ? "Switch to Draw" : "Switch to Eraser"}
              </button>
              <button
                type="button"
                onClick={clearCanvas}
                className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg shadow-md transition duration-200"
              >
                Clear Canvas
              </button>
            </div>
          </div>

          {getUserData?.apiCallRemaining && getUserData.apiCallRemaining > 0 ? (
            <button
              type="submit"
              className=" bg-purple-500 hover:bg-purple-600 text-white py-4 px-8 rounded-lg mt-5 font-bold shadow-lg transition duration-200 w-full "
            >
              Generate
            </button>
          ) : (
            <AlertApiCallComponent style=" bg-purple-500 hover:bg-purple-600 text-white py-4 px-8 rounded-lg mt-5 font-bold shadow-lg transition duration-200 w-full" />
          )}
        </form>
      </div>
      <div className="flex flex-col justify-center items-center w-full sm:w-1/2 space-y-6  relative   ">
        {loading ? (
          <div className="flex justify-center flex-col items-center text-white text-center">
            <Loading />
            <h2>Loading...</h2>
          </div>
        ) : getImage?.image && getImage.image.length > 0 ? (
          getImage.image.map((data, idx) => (
            <>
              <div
                key={idx}
                className="flex flex-col gap-4 justify-center items-center w-full relative "
              >
                <div>
                  <Image
                    src={data.image}
                    alt={`Image ${idx}`}
                    width={900}
                    height={900}
                    className="rounded-lg shadow-lg  o object-cover transition-transform transform hover:scale-105 duration-300"
                  />
                </div>
                <div className="flex flex-row justify-center items-center  gap-2 bg-blue-500 px-8 py-4 rounded-lg font-semibold text-center hover:bg-blue-600 cursor-pointer relative">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 640 512"
                    className="w-6 h-6 text-white"
                  >
                    <path
                      fill="currentColor"
                      d="M144 480C64.5 480 0 415.5 0 336c0-62.8 40.2-116.2 96.2-135.9c-.1-2.7-.2-5.4-.2-8.1c0-88.4 71.6-160 160-160c59.3 0 111 32.2 138.7 80.2C409.9 102 428.3 96 448 96c53 0 96 43 96 96c0 12.2-2.3 23.8-6.4 34.6C596 238.4 640 290.1 640 352c0 70.7-57.3 128-128 128l-368 0zm79-167l80 80c9.4 9.4 24.6 9.4 33.9 0l80-80c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-39 39L344 184c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 134.1-39-39c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9z"
                    />
                  </svg>
                  <button
                    onClick={() => handleDownload(data.image)}
                    className="text-white"
                  >
                    Download
                  </button>
                </div>
              </div>
            </>
          ))
        ) : (
          <div className="flex justify-center flex-col items-center text-white text-center gap-2">
            <Image
              src="https://aivaneezy-ai-bucket.s3.eu-north-1.amazonaws.com/loading/spike.gif"
              alt="spike"
              width={500}
              height={500}
              className="rounded-lg"
            />
            <h2 className="font-semibold text-1xl">No images generated</h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default SketchComponent;
