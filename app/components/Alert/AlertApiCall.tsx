import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Link from "next/link";
import React, {useContext} from "react";
import { DataContext } from "../../Context/Provider";

interface style {}

const AlertApiCallComponent = ({ style }: { style: string }) => {
    const {setSelectedItem } = useContext(DataContext);
  return (
    <div>
      <AlertDialog>
        <AlertDialogTrigger className={`${style}`}>Generate</AlertDialogTrigger>
        <AlertDialogContent className="bg-[#09090b] border-gray-500 font-semibold">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white ">
              You've run out of bits😔
            </AlertDialogTitle>
            <AlertDialogDescription>
              Please purchase more to continue using our products.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="text-white bg-[#09090b] hover:bg-gray-200">
              Cancel
            </AlertDialogCancel>
            <Link href="/dashboard/billing">
            <AlertDialogAction 
            onClick={() => setSelectedItem("Billing")}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-md hover:from-purple-600 hover:to-pink-600 transition duration-300 ease-in-out">
              Purchase
            </AlertDialogAction>
            </Link>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AlertApiCallComponent;
