import React from 'react'
import { useNavigate } from "react-router-dom";
import { handleToast } from '../utils/helper';
import axiosInstance from '../axiosConfig';

const Navbar = () => {
    const navigate = useNavigate();

  const handleLogout = async () => { 
    try {
      const res = await axiosInstance.delete("/logout");
    } catch (error) {
      return handleToast(error?.response?.data?.error);
    }
  }
  return (
    <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex-shrink-0 flex items-center">
              <span onClick={()=>navigate("/")} className="text-2xl font-bold text-blue-600 cursor-pointer">PMP</span>
            </div>
            <div className="flex items-center">
              <button onClick={()=>navigate("/my-pdfs")} className="ml-4 px-4 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                My PDFs
              </button>
              <button onClick={handleLogout} className="ml-4 px-4 py-2 rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
  )
}

export default Navbar