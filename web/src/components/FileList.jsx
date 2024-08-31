import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RenameModal from './RenameFile';
import { useSelector } from 'react-redux';

export default function FileList( { files, loading, error }) {
  //const [files, setFiles] = useState([]);
  const token = useSelector((state) => state.user.currentUser?.token);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [fileToRename, setFileToRename] = useState(null);
  const [newFileName, setNewFileName] = useState("");

  const closeRenameModal = () => {
    setIsRenameModalOpen(false);
    setFileToRename(null);
    setNewFileName("");
  };

  const openRenameModal = (file) => {
    setFileToRename(file);
    setNewFileName(file.fileName);
    setIsRenameModalOpen(true);
  };

  
  const handleRenameFile = async () => {
    try {
      await axios.put(
        "/api/files/update",
        {
          fileId: fileToRename._id,
          newFileName,
        },
        {
          headers: { Authorization: `Bearer ${currentUser.token}` },
        }
      );
      setFiles(
        files.map((file) =>
          file._id === fileToRename._id
            ? { ...file, fileName: newFileName }
            : file
        )
      );
      closeRenameModal();
    } catch (error) {
      console.error("Error updating file name:", error);
    }
  };

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
                    <th className="py-2">Name</th>
                    <th className="py-2">Uploaded By</th>
                    <th className="py-2">Date Created</th>
                    <th className="py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {files.map((file) => (
                    <tr key={file._id}>
                      <td className="border px-4 py-2">{file.fileName}</td>
                      <td className="border px-4 py-2">
                        {file.uploadedBy.username}
                      </td>
                      <td className="border px-4 py-2">
                        {new Date(file.uploadDate).toLocaleDateString()}
                      </td>
                      <td className="border px-4 py-2">
                        <button
                          onClick={() => handleDeleteFile(file._id)}
                          className="text-red-600"
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => openRenameModal(file)}
                          className="ml-2 text-blue-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleTestFile(file._id)}
                          className="ml-2 text-green-600"
                        >
                          Test
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
