import { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

export default function FileUpload() {
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
        'http://localhost:3000/api/files/upload',
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
    } catch (error) {
      setError('Error uploading file. Please try again.');
      console.error('Error uploading file:', error);
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div className="p-8">
      <div className="bg-white shadow rounded p-8">
        <div className="flex justify-between mb-4">
          <button
            onClick={handleUploadClick}
            className="bg-black text-white py-2 px-4 rounded"
            disabled={loading} 
          >
            {loading ? 'Uploading...' : 'Subir archivo'}
          </button>
          <button className="bg-gray-200 py-2 px-4 rounded">
            Recent
          </button>
        </div>
        <div
          className="border-2 border-dashed border-gray-300 p-8 text-center text-gray-500 cursor-pointer"
          onClick={() => document.getElementById('file-input').click()}
        >
          <input
            type="file"
            id="file-input"
            className="hidden"
            onChange={handleFileChange}
          />
          <p>{file ? file.name : 'Click to browse or drag and drop your files'}</p>
        </div>
        {uploadedFileName && (
          <div className="mt-4 text-green-500">
            File Uploaded: {uploadedFileName}
          </div>
        )}
        {error && (
          <div className="mt-4 text-red-500">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
