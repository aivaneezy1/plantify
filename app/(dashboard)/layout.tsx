import React from "react"
import Sidebar from "../components/Dashboard/SideBar"
const DashBoardLayout = ({children}: {children: React.ReactNode}) =>{
    return (
        <div className="grid grid-cols-1 md:grid-cols-[1fr_3fr] w-full">
        <div className="max-h-[400px]  flex-grow-0">
        <Sidebar /> 
        </div>
        <div>
        {children}
        </div>
      </div>
    )
}


export default DashBoardLayout