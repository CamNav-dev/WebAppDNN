import React, { useState } from 'react';
import axios from 'axios';
import RenameModal from './RenameFile';
import { useSelector } from 'react-redux';

export default function FileList({ files, loading, error, onFileUpdate }) {
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
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (typeof onFileUpdate === 'function') {
        onFileUpdate();
      } else {
        console.warn('onFileUpdate is not a function. File list may not update automatically.');
      }
      closeRenameModal();
    } catch (error) {
      console.error("Error updating file name:", error);
      alert("Failed to update file name. Please try again.");
    }
  };

  const handleDeleteFile = async (fileId) => {
    try {
      await axios.delete(`/api/files/delete/${fileId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (typeof onFileUpdate === 'function') {
        onFileUpdate();
      } else {
        console.warn('onFileUpdate is not a function. File list may not update automatically.');
      }
    } catch (error) {
      console.error("Error deleting file:", error);
      alert("Failed to delete file. Please try again.");
    }
  };

  const handleTestFile = async (fileId) => {
    try {
      const response = await axios.post(
        `/api/files/test/${fileId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("File processed successfully:", response.data);
      alert(
        `File processed successfully:\n${JSON.stringify(
          response.data.output,
          null,
          2
        )}`
      );
    } catch (error) {
      console.error("Error testing file:", error);
      if (error.response) {
        console.error("Error response:", error.response.data);
        alert(
          `Error processing file: ${error.response.data.message}\n${error.response.data.error}`
        );
      } else {
        alert(`Error processing file: ${error.message}`);
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Reportes cargados</h2>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2">Nombre</th>
            <th className="py-2">Owner</th>
            <th className="py-2">Fecha subida</th>
            <th className="py-2">Acciones</th>
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