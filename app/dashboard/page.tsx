import React from 'react';

const DashBoardPage = () => {
  return (
    <div className="flex justify-center items-center mt-20 gap-10 font-semibold ">
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="shadow-lg p-6 bg-blue-500 text-white rounded-md cursor-pointer transition transform hover:scale-105 duration-300">
          <h2 className="text-xl font-semibold">Trial🔒</h2>
        </div>
        <div className="shadow-lg p-6 bg-green-500 text-white rounded-md transition transform hover:scale-105 duration-300">
          <h2 className="text-xl font-semibold">2</h2>
          <span>Call Since Aug 1, 2024</span>
        </div>
        <div className="shadow-lg p-6 bg-yellow-500 text-white rounded-md transition transoform hover:scale-105 duration-300">
          <h2 className="text-xl font-semibold">30📈</h2>
          <span>Api Call Remaining</span>
        </div>
        <div className="shadow-lg p-6 bg-red-500 text-white rounded-md  transition transoform hover:scale-105 duration-300">
          <h2 className="text-xl font-semibold">30📊</h2>
          <span>Total Api Call</span>
        </div>
      </div>
    </div>
  );
};

export default DashBoardPage;
