import React from "react";
import Image from "next/image";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
const RecentRequestsComponent = () => {
  const getUserData = useQuery(api.createUser.currentUser, {});
  // Sample data array to represent multiple requests
  // const getUserData = {
  //    _creationTime: 1725704254515.2874,
  // _id: "jh79aaqj39s19ajp09kyb8a4dh70a991",
  // apiCallRemaining: 8495,
  // apiCallTotal: 8500,
  // bits: [250, 1250, 500, 1000, 250, 500, 250, 1500, 500, 1000, 500, 1000],
  // email: "aivaneezydakii@gmail.com",
  // firstName: "hello",
  // imagesUrl: [],
  // }


  const handleDownloadImage = async (imageUrl: string) => {
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
      throw new Error((error as { message: string }).message);
    }
  };

  return (
    <div className="flex justify-center items-center text-2xl w-full mt-20 sm:ml-10">
      <div className="bg-[#434C5E] text-white p-8 rounded-lg mb-5 shadow-lg w-full max-w-4xl">
        <h2 className="text-3xl font-semibold mb-4">Recent Requests</h2>
        <hr className="my-4 border-white" />
        <div className="flex flex-col gap-8 w-full">
          {getUserData && getUserData.imagesUrl.length > 0 ? getUserData?.imagesUrl.map((src, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row justify-between items-center sm:items-start gap-5 border border-gray-300 p-4 rounded-lg shadow-md"
            >
              <div className="flex flex-col gap-5 sm:items-start">
                <Image
                  src={src}
                  alt={`image-${index}`}
                  width={250}
                  height={250}
                  className="rounded-lg shadow-md border-b-2"
                />
              </div>

              <div className="flex flex-col gap-5 justify-center sm:items-start w-full sm:w-auto">
                <button onClick={() =>handleDownloadImage(src)} className="p-4 bg-blue-500 text-white hover:bg-blue-600 rounded-lg shadow-md sm:w-auto mt-5">
                  Download
                </button>
              </div>
            </div>
          )): (
            <div>
            <h2>No Record Found</h2>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecentRequestsComponent;
