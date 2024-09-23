import Navbar from '../components/Navbar';
import axiosInstance from '../axiosConfig';
import { handleToast } from '../utils/helper';
import PdfViewer from '../components/PdfList';
import { useNavigate } from 'react-router-dom';
import React, { useContext, useState } from 'react';
import { UserContext } from '../context/userContext';

const Home = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const { user } = useContext(UserContext);
  const [uploadedPdf, setUploadedPdf] = useState(null);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!user) return navigate("/signin");

    const formData = new FormData();
    formData.append("userPdf", file);

    try {
      const { data } = await axiosInstance.post("/upload-pdf",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );

      setUploadedPdf({ fileName: data?.fileName, filePath: data?.filePath });
      return handleToast("PDF Uploaded Successfully");
    } catch (error) {
      return handleToast(error?.response?.data?.error);
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file && file.type !== "application/pdf") {
      return handleToast("Upload a valid PDF Document");
    }
    console.log(file.size);
    if (file.size > 2000000) {
      return handleToast("Too large file. Size limit is 2MB");
    }

    return setFile(file);
  }

  return (<>
    <Navbar />
    <div className="max-w-6xl mx-auto px-4 py-8">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">PickMyPages</h1>
        <p className="text-xl text-gray-600">Upload, view, and extract pages from your PDF documents</p>
      </header>

      <main className="space-y-8">
        <section className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Upload PDF</h2>
          <p className="text-gray-600 mb-4">Select a PDF file to upload and manage</p>
          <form onSubmit={handleUpload} className="space-y-4">
            <div>
              <label htmlFor="userPdf" className="block text-sm font-medium text-gray-700 mb-1">
                Choose a PDF file
              </label>
              <input
                onChange={handleFileChange}
                type="file"
                accept='application/pdf'
                name="userPdf"
                id="userPdf"
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
              />
            </div>
            <button
              type='submit'
              className={`w-full sm:w-auto px-4 py-2 text-sm font-medium text-white rounded-md ${file ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
              disabled={!file}
            >
              Upload PDF
            </button>
          </form>
        </section>

        <section className="bg-white shadow-md rounded-lg p-6">
          {uploadedPdf ? (
            <PdfViewer
              fileUrl={`${import.meta.env.VITE_BACKEND}/pdfs/${uploadedPdf?.fileName}`}
              fileName={uploadedPdf?.fileName}
            />
          ) : (
            <p className="text-gray-600 text-center">No PDF uploaded yet. Upload a PDF to view and manage it here.</p>
          )}
        </section>
      </main>
    </div>
  </>
  )
}

export default Home