import moment from "moment";
import Navbar from '../components/Navbar';
import axiosInstance from '../axiosConfig';
import { handleToast } from '../utils/helper';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/userContext';
import React, { useState, useEffect, useContext } from 'react';

const MyPdfs = () => {
    const navigate = useNavigate();
    const [pdfs, setPdfs] = useState([]);
    const { user } = useContext(UserContext);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return navigate("/signin");
        fetchPdfs();
    }, []);

    const fetchPdfs = async () => {
        try {
            const response = await axiosInstance.get('/pdfs');
            setPdfs(response?.data);
            setLoading(false);
        } catch (error) {
            handleToast('Error fetching PDFs');
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axiosInstance.delete(`/pdfs/${id}`);
            setPdfs(pdfs.filter(pdf => pdf.id !== id));
            handleToast('PDF deleted successfully');
        } catch (error) {
            handleToast('Error deleting PDF');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Navbar */}
            <Navbar />

            {/* Main content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">My PDFs</h1>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                ) : pdfs.length === 0 ? (
                    <p className="text-center text-gray-600">No PDFs found. Upload some PDFs to get started!</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {pdfs.map((pdf) => (
                            <div key={pdf._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                                <div className="p-4">
                                    <h2 className="text-lg font-semibold text-gray-800 mb-2 truncate">{pdf.fileName}</h2>
                                    <p className="text-sm text-gray-600 mb-4">Uploaded on: {moment(pdf.createdAt).format("DD-MM-YYYY")}</p>
                                    <div className="flex justify-between">
                                        <a
                                            href={`${import.meta.env.VITE_BACKEND}${pdf.pdfUrl}`}
                                            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
                                        >
                                            View
                                        </a>
                                        <button
                                            onClick={() => handleDelete(pdf.id)}
                                            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition duration-300"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyPdfs;