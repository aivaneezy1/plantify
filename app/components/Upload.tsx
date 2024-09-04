"use client";
import React, {
  ChangeEvent,
  useState,
  useEffect,
  FormEvent,
  useRef,
  use,
} from "react";
import Image from "next/image";
import { useMutation } from "convex/react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
const UploadComponent = () => {
  const [inputSketch, setInputSketch] = useState("");

  // Creating data for our convex table
  const createTable = useMutation(api.todo.createTodo);

  // Query data from our convex table
  const getData = useQuery(api.todo.getTodo);

  const [images, setImages] = useState<string[]>([]);
  const [openAiResponse, setOpenAiResponse] = useState<string>("");

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (files) {
      const newBase64Strings: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        //  new FileReader instance for every image
        const reader = new FileReader();
        reader.onloadend = () => {
          if (reader.result) {
            newBase64Strings.push(reader.result as string);
            setImages((prev) => [...prev, reader.result as string]);
          }
        };

        // reading the File
        reader.readAsDataURL(file);

        reader.onerror = (err) => {
          console.error(err);
        };
      }
    }
  };

  useEffect(() => {
    // Cleanup function for base64 strings
    return () => {
      setImages([]);
    };
  }, []); // Empty dependency array ensures cleanup runs on unmount

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await createTable({ text: inputSketch }); // Pass an object with text key
    } catch (error) {
      console.error("Error creating table:", error);
    }
  };

  
  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <div className="bg-slate-800 w-full max-w-2xl rounded-lg shadow-lg p-8">
        <form onSubmit={(e) => handleSubmit(e)}>
          <input
            type="text"
            value={inputSketch}
            onChange={(e) => setInputSketch(e.target.value)}
            className="mb-4 text-black border rounded-lg cursor-pointer w-full"
          />

          <input
            type="file"
            onChange={(e) => handleFileChange(e)}
            className="mb-4 text-white border rounded-lg cursor-pointer w-full"
            multiple
          />
          <h2 className="text-xl font-bold mb-4 text-white">Uploaded Image</h2>
          <div className="flex flex-row flex-wrap gap-4">
            {images.length > 0 ? (
              images.map((base64, index) => (
                <div key={index} className="relative w-32 h-32">
                  <Image
                    src={base64}
                    alt={`Selected Image ${index + 1}`}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-lg"
                  />
                </div>
              ))
            ) : (
              <div className="flex justify-center items-center w-full">
                <h2 className=" text-white font-2xl mb-5 text-center">
                  Uploaded Images will be shown here.
                </h2>
              </div>
            )}
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="p-2 bg-sky-600 rounded-md mb-4 w-full text-white"
            >
              Ask me anything
            </button>
          </div>
        </form>

        <div className="border-t border-gray-300 pt-4">
          <h2 className="text-xl font-bold mb-2 text-white">
            Convex Table content
          </h2>

          {getData?.map((data, index) => (
            <div key={index}>
              <h2 className="text-white">{data.text}</h2>
              
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UploadComponent;
