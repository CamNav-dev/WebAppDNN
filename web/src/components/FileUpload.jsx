import { useState } from 'react';
import axios from 'axios';

export default function FileUpload() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false); 
  const [uploadedFileName, setUploadedFileName] = useState('');

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUploadClick = async () => {
    if (!file) {
      alert('Please select a file first.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:3000/api/files/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true, 
      });
      
      alert('File uploaded successfully');
      console.log(response.data);

    
      setUploadedFileName(response.data.file.fileName);

      setFile(null);
    } catch (error) {
      alert('Error uploading file');
      console.error(error);
    } finally {
      setLoading(false);
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
      </div>
    </div>
  );
}
