"use client";
import React, { useContext } from "react";
import { DataContext } from "@/app/Context/Provider";
import Sidebar from "@/app/components/Dashboard/SideBar";
import DashboardComponent from "@/app/components/Dashboard/Dashboard";
import BillingComponent from "@/app/components/Dashboard/Billing";
import SettingsComponent from "@/app/components/Dashboard/Settings";
import RecentRequestsComponent from "@/app/components/Dashboard/RecentRequests";
const DashBoardPage = () => {
  const { selectedItem } = useContext(DataContext);

  const showComponent = (item: string) => {
    switch (item) {
      case "DashBoard":
        return <DashboardComponent />;
      case "Billing":
        return <BillingComponent />;

      case "Requests":
        return <RecentRequestsComponent />;
      case "Settings":
        return <SettingsComponent />;
    }
  };

  return (
    <div className="flex w-full ">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_3fr] w-full">
        <Sidebar /> {/* The Sidebar will take up 1/4 of the grid */}
        {showComponent(selectedItem)}
      </div>
    </div>
  );
};

export default DashBoardPage;
