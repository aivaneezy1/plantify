"use client";
import React, {
  createContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";
import { Id } from "@/convex/_generated/dataModel"; // Assuming this is correct in your setup

// Interface for the context
interface DatiContextType {
    selectedItem: string;
    setSelectedItem: Dispatch<SetStateAction<string>>;
    getIdLocalStorage: Id<"users"> | null;  // Adjusting this to be nullable for the initial state
    setGetIdLocalStorage: Dispatch<SetStateAction<Id<"users"> | null>>;  // Adjust the Dispatch to handle the correct type
}

// Default context value
const defaultContextValue: DatiContextType = {
    selectedItem: "DashBoard",
    setSelectedItem: () => {
        throw new Error("setSelectedItem function must be overridden");
    },
    getIdLocalStorage: null,  // Set the default value to null since we don't have an ID initially
    setGetIdLocalStorage: () => {
        throw new Error("setUserTableId function must be overridden");
    },
};

// Create the context
export const DataContext = createContext<DatiContextType>(defaultContextValue);

// Context provider
const DataContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [selectedItem, setSelectedItem] = useState<string>("DashBoard");
    const [userTableId, setUserTableId] = useState<Id<"users"> | null>(null); // Initialize with null

    return (
        <DataContext.Provider
            value={{
                selectedItem,
                setSelectedItem,
                getIdLocalStorage: userTableId,
                setGetIdLocalStorage: setUserTableId,
            }}
        >
            {children}
        </DataContext.Provider>
    );
};

export default DataContextProvider;
