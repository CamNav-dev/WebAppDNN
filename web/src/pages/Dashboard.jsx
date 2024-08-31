import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import FileUpload from "../components/RenameModal";
import RenameModal from "../components/RenameFile";
import FileList from "../components/FileList";
import axios from "axios";
import { useSelector } from "react-redux";

export default function Dashboard() {
  const { currentUser } = useSelector((state) => state.user);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');


  useEffect(() => {
    fetchFiles();
  }, [currentUser.token]);

  const handleDeleteFile = async (fileId) => {
    try {
      await axios.delete(`/api/files/delete/${fileId}`, {
        headers: { Authorization: `Bearer ${currentUser.token}` },
      });
      setFiles(files.filter((file) => file._id !== fileId));
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  };

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/files/files", {
        headers: { Authorization: `Bearer ${currentUser.token}` },
      });
      setFiles(response.data);

    } catch (error) {
      setError(error);
      console.error("Error fetching files:", error);
    }
    setLoading(false);
  };






  const handleTestFile = async (fileId) => {
    try {
      const response = await axios.post(
        `/api/files/test/${fileId}`,
        {},
        {
          headers: { Authorization: `Bearer ${currentUser.token}` },
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


  const callBackUploadedFile = () => {
    fetchFiles();
  }

  return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex flex-col">
        <section className="bg-gray-100 py-12 px-8 flex-1">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold">Dashboard</h1>
              {currentUser && (
                <div className="text-right">
                  <p className="text-lg font-semibold">
                    {currentUser.username}
                  </p>
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
            <FileList files={files} loading={loading} error={error}/>
          
            <div className="mt-16">
              <h2 className="text-2xl font-bold mb-4">Upload Files</h2>
              <FileUpload callback={callBackUploadedFile} />
            </div>
          </div>
        </section>
      </div>

    </div>
  );
}