import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import FileUpload from "../components/RenameModal";
import FileList from "../components/FileList";
import axios from "axios";
import { useSelector } from "react-redux";

export default function Dashboard() {
  const { currentUser } = useSelector((state) => state.user);
  const [files, setFiles] = useState([]);
  const [outputFiles, setOutputFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFiles();
    fetchOutputFiles();
  }, [currentUser.token]);

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/files/files", {
        headers: { Authorization: `Bearer ${currentUser.token}` },
      });
      console.log("Files fetched:", response.data);
      setFiles(response.data);
    } catch (error) {
      console.error("Error fetching files:", error);
      setError(error);
    }
    setLoading(false);
  };

  const fetchOutputFiles = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/files/output-files", {
        headers: { Authorization: `Bearer ${currentUser.token}` },
      });
      console.log("Output files fetched:", response.data);
      setOutputFiles(response.data);
    } catch (error) {
      console.error("Error fetching output files:", error);
      setError(error);
    }
    setLoading(false);
  };

  const callBackUploadedFile = () => {
    fetchFiles();
  }

  return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex flex-col mx-32">
        <section className="py- px-10 flex-1">
          <div className="container px-4">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold">Dashboard</h1>
              {currentUser && (
                <div className="text-right">
                  <p className="text-lg fonst-semibold">
                    {currentUser.username}
                  </p>
                </div>
              )}
            </div>
            
            <div className="mb-4">
              
            </div>
            <div className="mt-16">
              <FileUpload callback={callBackUploadedFile} />
            </div>
            <FileList
              files={files}
              outputFiles={outputFiles}
              loading={loading}
              error={error}
              onFileUpdate={fetchFiles}
              onOutputFileUpdate={fetchOutputFiles}
            />
            
          </div>
        </section>
      </div>
    </div>
  );
}