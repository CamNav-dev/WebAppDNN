import React, { useEffect, useState } from 'react';
import Sidebar from "../components/Sidebar";  
import FileUpload from "../components/RenameModal"; 
import RenameModal from "../components/RenameModal"; // Asegúrate de importar tu componente RenameModal
import axios from 'axios';
import { useSelector } from 'react-redux';

export default function Dashboard() {
  const { currentUser } = useSelector(state => state.user);
  const [files, setFiles] = useState([]);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [fileToRename, setFileToRename] = useState(null);
  const [newFileName, setNewFileName] = useState('');

  useEffect(() => {
    // Fetch files from the server on component mount
    const fetchFiles = async () => {
      try {
        const response = await axios.get('/api/files/allfiles', {
          headers: { 'Authorization': `Bearer ${currentUser.token}` }
        });
        setFiles(response.data);
      } catch (error) {
        console.error('Error fetching files:', error);
      }
    };
    fetchFiles();
  }, [currentUser.token]);

  const handleDeleteFile = async (fileId) => {
    try {
      await axios.delete(`http://localhost:3000/api/files/delete/${fileId}`, {
        headers: { 'Authorization': `Bearer ${currentUser.token}` }
      });
      setFiles(files.filter(file => file._id !== fileId)); // Update the file list
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };

  const openRenameModal = (file) => {
    setFileToRename(file);
    setNewFileName(file.fileName);
    setIsRenameModalOpen(true);
  };

  const closeRenameModal = () => {
    setIsRenameModalOpen(false);
    setFileToRename(null);
    setNewFileName('');
  };

  const handleRenameFile = async () => {
    try {
      await axios.put('/api/files/update', {
        fileId: fileToRename._id,
        newFileName
      }, {
        headers: { 'Authorization': `Bearer ${currentUser.token}` }
      });
      setFiles(files.map(file => file._id === fileToRename._id ? { ...file, fileName: newFileName } : file));
      closeRenameModal();
    } catch (error) {
      console.error('Error updating file name:', error);
    }
  };
  
  const handleTestFile = async (fileId) => {
    try {
      const response = await axios.post(`http://localhost:3000/api/files/test/${fileId}`, {}, {
        headers: { 'Authorization': `Bearer ${currentUser.token}` }
      });
      console.log('File processed successfully:', response.data);
      // Display the results to the user
      alert(`File processed successfully:\n${JSON.stringify(response.data.output, null, 2)}`);
    } catch (error) {
      console.error('Error testing file:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        alert(`Error processing file: ${error.response.data.message}\n${error.response.data.error}`);
      } else {
        alert(`Error processing file: ${error.message}`);
      }
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex flex-col">
        <section className="bg-gray-100 py-12 px-8 flex-1">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold">Dashboard</h1>
              {currentUser && (
                <div className="text-right">
                  <p className="text-lg font-semibold">{currentUser.username}</p>
                </div>
              )}
            </div>

            <div className="mb-4">
              <button className="bg-black text-white py-2 px-4 rounded">
                Add Folder
              </button>
              <button className="bg-black text-white py-2 px-4 rounded ml-2">
                Upload File
              </button>
            </div>

            <div className="bg-white shadow rounded-lg p-8">
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="py-2">Name</th>
                    <th className="py-2">Uploaded By</th>
                    <th className="py-2">Date Created</th>
                    <th className="py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {files.map(file => (
                    <tr key={file._id}>
                      <td className="border px-4 py-2">{file.fileName}</td>
                      <td className="border px-4 py-2">{file.uploadedBy.username}</td>
                      <td className="border px-4 py-2">{new Date(file.uploadDate).toLocaleDateString()}</td>
                      <td className="border px-4 py-2">
                        <button onClick={() => handleDeleteFile(file._id)} className="text-red-600">
                          Delete
                        </button>
                        <button onClick={() => openRenameModal(file)} className="ml-2 text-blue-600">Edit</button>
                        <button onClick={() => handleTestFile(file._id)} className="ml-2 text-green-600">Test</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-16">
              <h2 className="text-2xl font-bold mb-4">Upload Files</h2>
              <FileUpload />
            </div>
          </div>
        </section>
      </div>
      <RenameModal
        isOpen={isRenameModalOpen}
        onClose={closeRenameModal}
        onSave={handleRenameFile}
        fileName={newFileName}
        setFileName={setNewFileName}
      />
    </div>
  );
}
