"use client";
import React from "react";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { serialize } from "v8";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
const DashboardComponent = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  let profileUrL: string | undefined;
  if (user?.imageUrl) {
    profileUrL = user.imageUrl;
  }

  const getUserData = useQuery(api.createUser.currentUser, {});

  const lastApiCallMade: string | undefined = getUserData?.apiUsageTimeStamp[0];

  return (
    <>
      <div className="flex flex-col justify-center items-center mt-20 gap-10 font-semibold mb-5 ">
        {/*User profile */}
        {user ? (
          <div className="flex flex-row  w-full  md:ml-40">
            <div className="flex flex-row gap-3">
              <Image
                src={profileUrL!}
                alt={`${user?.firstName} profile`}
                width={100}
                height={100}
                className="rounded-full"
              />
              <div className="flex flex-col gap-2">
                <h2 className="text-lg font-bold">{user?.fullName}</h2>
                <h2 className="text-lg text-gray-400">
                  {user?.primaryEmailAddress?.emailAddress}
                </h2>
                <h2 className="bg-[#434C5E] p-1 rounded-lg">{user?.id}</h2>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-bold text-center">User not Found</h2>
          </div>
        )}

        {/*Grid boxes */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 ">
          <div className="shadow-lg p-6 bg-blue-500 text-white rounded-md cursor-pointer transition transform hover:scale-105 duration-300">
            <h2 className="text-2xl font-semibold ">{getUserData?.status}</h2>
            <span>Current Plan</span>
          </div>
          <div className="shadow-lg p-6 bg-green-500 text-white rounded-md transition transform hover:scale-105 duration-300">
            <h2 className="text-2xl font-semibold">{getUserData?.apiUsage}</h2>
            <span>Call Since {lastApiCallMade}</span>
          </div>
          <div className="shadow-lg p-6 bg-yellow-500 text-white rounded-md transition transoform hover:scale-105 duration-300">
            <h2 className="text-2xl font-semibold">
              {getUserData?.apiCallRemaining}
            </h2>
            <span>Api Call Remaining</span>
          </div>
          <div className="shadow-lg p-6 bg-red-500 text-white rounded-md  transition transoform hover:scale-105 duration-300">
            <h2 className="text-2xl font-semibold">
              {getUserData?.apiCallTotal}
            </h2>
            <span>Total Api Call</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardComponent;
