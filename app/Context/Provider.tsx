"use client";
import React, {
  createContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";



interface DatiContextType {
    selectedItem: string,
    setSelectedItem: Dispatch<SetStateAction<string>>,
}

const defaultContextValue: DatiContextType = {
    selectedItem: "DashBoard",
    setSelectedItem: () => {
        throw new Error("selectedItem function must be overridden")
    }
}

export const DataContext = createContext<DatiContextType>(defaultContextValue);

const DataContextProvider =({children}: {children:React.ReactNode}) => {
    const [selectedItem, setSelectedItem] = useState("DashBoard");
    return (
        <DataContext.Provider
        value={{
            selectedItem,
            setSelectedItem
        }}>
        
        {children}
        </DataContext.Provider>
    )
} 

export default DataContextProvider