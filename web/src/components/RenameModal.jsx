import { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

export default function FileUpload( {callback} ) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false); 
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [error, setError] = useState(''); // To track errors

  // Access token from Redux store
  const token = useSelector((state) => state.user.currentUser?.token); 

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setUploadedFileName(''); // Clear previous upload info
  };

  const handleUploadClick = async () => {
    if (!token) {
      setError('No token found. Please login first.');
      return;
    }
    if (!file) {
      setError('No file selected. Please choose a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      setLoading(true); // Set loading state to true
      setError(''); // Clear previous errors

      const response = await axios.post(
        '/api/files/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`, // Use the token here
          },
          withCredentials: true, // If using cookies
        }
      );

      setUploadedFileName(response.data.file.fileName); // Update state with uploaded file name
      console.log(response.data);
      callback();
    } catch (error) {
      setError('Error uploading file. Please try again.');
      console.error('Error uploading file:', error);
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-md p-6 mb-6">
      <div className="flex items-center justify-center w-full">
        <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
            </svg>
            <p className="mb-2 text-sm text-gray-500">
              <span className="font-semibold">Drag and Drop or Upload</span> a file
            </p>
            <p className="text-xs text-gray-500">EXCEL ONLY PLEASE</p>
          </div>
          <input id="dropzone-file" type="file" className="hidden" onChange={handleFileChange} />
        </label>
      </div>
      {file && (
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">{file.name}</span>
          <button
            onClick={handleUploadClick}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? 'Uploading...' : 'Upload'}
          </button>
        </div>
      )}
      {error && (
        <div className="mt-4 text-red-500 text-sm">
          {error}
        </div>
      )}
    </div>
  );
}
