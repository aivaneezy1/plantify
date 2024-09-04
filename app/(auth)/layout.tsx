import React from "react";
const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className=" flex justify-center items-center h-screen">
      <div className="w-full max-w-md p-8 space-y-6 bg-[#434C5E] rounded-lg shadow-lg">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout