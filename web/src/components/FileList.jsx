import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

export default function FileList() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const token = useSelector((state) => state.user.currentUser?.token);

  useEffect(() => {
    fetchFiles();
  }, [token]);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3000/api/files', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFiles(response.data);
    } catch (err) {
      setError('Error fetching files');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (fileId) => {
    try {
      await axios.delete(`http://localhost:3000/api/files/${fileId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchFiles(); // Refresh the list
    } catch (err) {
      setError('Error deleting file');
      console.error(err);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Uploaded Files</h2>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Name</th>
            <th className="py-2 px-4 border-b">Date created</th>
            <th className="py-2 px-4 border-b">Uploaded by</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {files.map((file) => (
            <tr key={file._id}>
              <td className="py-2 px-4 border-b">{file.fileName}</td>
              <td className="py-2 px-4 border-b">{new Date(file.createdAt).toLocaleDateString()}</td>
              <td className="py-2 px-4 border-b">{file.uploadedBy.username}</td>
              <td className="py-2 px-4 border-b">
                <button onClick={() => handleDelete(file._id)} className="text-red-500 hover:text-red-700">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
