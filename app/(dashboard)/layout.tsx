import React from "react"
import Sidebar from "../components/Dashboard/SideBar"
const DashBoardLayout = ({children}: {children: React.ReactNode}) =>{
    return (
        <div className="grid grid-cols-1 md:grid-cols-[1fr_3fr] w-full">
        <Sidebar /> 
        {children}
      </div>
    )
}


export default DashBoardLayout