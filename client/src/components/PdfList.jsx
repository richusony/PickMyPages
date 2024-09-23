import React, { useState } from 'react';
import { Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

import { Viewer } from '@react-pdf-viewer/core';
import { handleToast } from '../utils/helper';
import axiosInstance from '../axiosConfig';

const PdfViewer = ({ fileUrl, fileName }) => {
  const [pdfDownloadUrl, setPdfDownloadUrl] = useState(null);
  const [formData, setFormData] = useState({
    pageStart: null,
    pageEnd: null,
    fileName
  });
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  const handleExtractPdf = async (e) => {
    e.preventDefault();

    console.log(formData);
    if (!formData.pageStart || formData.pageStart <= 0 || !formData.pageEnd) {
      return handleToast("Enter a valid page number");
    }

    try {
      const { data } = await axiosInstance.post("/create-pdf", formData);
      const downloadUrl = `${import.meta.env.VITE_BACKEND}/pdfs/${data?.fileName}`
      setPdfDownloadUrl(downloadUrl);
      setFormData({
        pageStart: null,
        pageEnd: null,
        fileName
      });
    } catch (error) {
      return handleToast(error?.response?.data?.error);
    }
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: parseInt(e.target.value)
    })
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-8">
      {pdfDownloadUrl !== null ? (
        <a 
          href={pdfDownloadUrl} 
          download="newPdf.pdf"
          className="inline-block px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-300 mb-4"
        >
          Download Extracted PDF
        </a>
      ) : (
        <div className="mb-8">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">Extract Pages</h3>
          <form onSubmit={handleExtractPdf} className="space-y-4">
            <div className="flex flex-wrap -mx-2">
              <div className="w-full sm:w-1/2 px-2 mb-4 sm:mb-0">
                <label htmlFor="pageStart" className="block text-sm font-medium text-gray-700 mb-1">From</label>
                <input 
                  onChange={handleInputChange} 
                  type="number" 
                  name="pageStart" 
                  id="pageStart" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="w-full sm:w-1/2 px-2">
                <label htmlFor="pageEnd" className="block text-sm font-medium text-gray-700 mb-1">To</label>
                <input 
                  onChange={handleInputChange} 
                  type="number" 
                  name="pageEnd" 
                  id="pageEnd" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <button 
              type='submit' 
              className="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
            >
              Create New PDF
            </button>
          </form>
        </div>
      )}

      <h2 className="text-2xl font-bold text-gray-800 mb-4">PDF Preview</h2>
      {fileUrl ? (
        <div className="h-[600px] border border-gray-300 rounded-md overflow-hidden">
          <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}>
            <Viewer fileUrl={fileUrl} plugins={[defaultLayoutPluginInstance]} />
          </Worker>
        </div>
      ) : (
        <p className="text-gray-600 italic">No PDF file to display</p>
      )}
    </div>
  );
};

export default PdfViewer;