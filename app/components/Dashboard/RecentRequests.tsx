import React from "react";
import Image from "next/image";

const RecentRequestsComponent = () => {
  // Sample data array to represent multiple requests
  const requests = [
    { src: "/ai.webp", createdAt: "26 Aug 2024" },
    { src: "/ai.webp", createdAt: "26 Aug 2024" },
    // Add more items here as needed
  ];

  return (
    <div className="flex justify-center items-center text-2xl w-full mt-20 sm:ml-10">
      <div className="bg-[#434C5E] text-white p-8 rounded-lg mb-5 shadow-lg w-full max-w-4xl">
        <h2 className="text-3xl font-semibold mb-4">Recent Requests</h2>
        <hr className="my-4 border-white" />
        <div className="flex flex-col gap-8 w-full">
          {requests.map((request, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row justify-between items-center sm:items-start gap-5 border border-gray-300 p-4 rounded-lg shadow-md"
            >
              <div className="flex flex-col gap-5 sm:items-start">
                <h2 className="text-xl font-medium">Images</h2>
                <Image
                  src={request.src}
                  alt={`image-${index}`}
                  width={250}
                  height={250}
                  className="rounded-lg shadow-md border-b-2"
                />
              </div>

              <div className="flex flex-col gap-5 justify-center sm:items-start w-full sm:w-auto">
                <h2 className="text-xl font-medium text-center sm:text-left">
                  Created at: {request.createdAt}
                </h2>
                <button className="p-4 bg-blue-500 text-white hover:bg-blue-600 rounded-lg shadow-md sm:w-auto mt-5">
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecentRequestsComponent;
