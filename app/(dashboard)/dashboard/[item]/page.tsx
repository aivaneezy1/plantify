"use client";
import React, { useContext } from "react";
import { DataContext } from "@/app/Context/Provider";

import BillingComponent from "@/app/components/Dashboard/Billing";

import RecentRequestsComponent from "@/app/components/Dashboard/RecentRequests";

const DashBoardPage = () => {
  const { selectedItem } = useContext(DataContext);

  const showComponent = (item: string) => {
    switch (item) {
      case "Billing":
        return <BillingComponent />;
      case "Requests":
        return <RecentRequestsComponent />;
    }
  };

  return <div>{showComponent(selectedItem)}</div>;
};

export default DashBoardPage;
