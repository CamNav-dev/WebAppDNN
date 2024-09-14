import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Menu,
  MenuItem,
  TableSortLabel,
  Checkbox,
  Button,
  CircularProgress,
  Alert,
  Snackbar,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import RenameModal from "./RenameFile";

export default function FileList({
  files: initialFiles,
  outputFiles: initialOutputFiles,
  loading,
  error,
  onFileUpdate,
  onOutputFileUpdate,
}) {

  const token = useSelector((state) => state.user.currentUser?.token);
  const [files, setFiles] = useState(initialFiles);
  const [outputFiles, setOutputFiles] = useState(initialOutputFiles);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [fileToRename, setFileToRename] = useState(null);
  const [newFileName, setNewFileName] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [orderBy, setOrderBy] = useState("uploadDate");
  const [order, setOrder] = useState("desc");
  const [testingFile, setTestingFile] = useState(null);
  const [testResult, setTestResult] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  console.log("FileList props:", { files, outputFiles, loading, error });

  useEffect(() => {
    setFiles(initialFiles);
    setOutputFiles(initialOutputFiles);
  }, [initialFiles, initialOutputFiles]);

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
    const sortedFiles = [...files].sort((a, b) => {
      if (property === "uploadDate") {
        return isAsc
          ? new Date(a[property]) - new Date(b[property])
          : new Date(b[property]) - new Date(a[property]);
      }
      return isAsc
        ? a[property].localeCompare(b[property])
        : b[property].localeCompare(a[property]);
    });
    setFiles(sortedFiles);
  };

  const closeRenameModal = () => {
    setIsRenameModalOpen(false);
    setFileToRename(null);
    setNewFileName("");
  };

  const openRenameModal = (file) => {
    setFileToRename(file);
    setNewFileName(file.fileName);
    setIsRenameModalOpen(true);
    handleMenuClose();
  };

  const handleRenameFile = async () => {
    try {
      await axios.put(
        "/api/files/update",
        { fileId: fileToRename._id, newFileName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (typeof onFileUpdate === "function") {
        onFileUpdate();
      }
      if (typeof onOutputFileUpdate === "function") {
        onOutputFileUpdate();
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
      if (typeof onFileUpdate === "function") {
        onFileUpdate();
      }
      if (typeof onOutputFileUpdate === "function") {
        onOutputFileUpdate();
      }
    } catch (error) {
      console.error("Error deleting file:", error);
      alert("Failed to delete file. Please try again.");
    }
    handleMenuClose();
  };
  
  const handleTestFile = async (fileId) => {
    setTestingFile(fileId);
    setTestResult(null);
    try {
      const response = await axios.post(
        `/api/files/test/${fileId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTestResult(response.data);
      if (typeof onOutputFileUpdate === "function") {
        onOutputFileUpdate();
      }
    } catch (error) {
      console.error("Error testing file:", error);
      setTestResult({ error: "An error occurred while testing the file." });
    }
    setTestingFile(null);
    handleMenuClose();
  };
  const handleDownload = async (documentId, fileName) => {
    try {
      const response = await axios.get(`/api/files/output/${documentId}`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
      });

      const contentType = response.headers["content-type"];
      const blob = new Blob([response.data], { type: contentType });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName || "output.docx");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      setSnackbar({
        open: true,
        message: "File downloaded successfully",
        severity: "success",
      });
    } catch (error) {
      console.error("Error downloading output document:", error);
      setSnackbar({
        open: true,
        message: "Failed to download file. Please try again.",
        severity: "error",
      });
    }
  };

  const handleMenuOpen = (event, file) => {
    setAnchorEl(event.currentTarget);
    setSelectedFile(file);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedFile(null);
  };

  if (loading) return <div>Loading...</div>;
if (error && error.response?.status === 403) {
  return <div>Error: You are not authorized to view these files. Please log in again.</div>;
}
if (error) return <div>Error: {error.message}</div>;


  return (
    <>
      <TableContainer component={Paper}>
        <h2>Uploaded Files</h2>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox />
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "fileName"}
                  direction={orderBy === "fileName" ? order : "asc"}
                  onClick={() => handleSort("fileName")}
                >
                  Name
                </TableSortLabel>
              </TableCell>
              <TableCell>Owner</TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "uploadDate"}
                  direction={orderBy === "uploadDate" ? order : "asc"}
                  onClick={() => handleSort("uploadDate")}
                >
                  Upload Date
                </TableSortLabel>
              </TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {files.map((file) => (
              <TableRow key={file._id}>
                <TableCell padding="checkbox">
                  <Checkbox />
                </TableCell>
                <TableCell>{file.fileName}</TableCell>
                <TableCell>{file.uploadedBy.username}</TableCell>
                <TableCell>
                  {new Date(file.uploadDate).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <IconButton onClick={(event) => handleMenuOpen(event, file)}>
                    <MoreVertIcon />
                  </IconButton>
                  {testingFile === file._id && <CircularProgress size={24} />}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TableContainer component={Paper} style={{ marginTop: "2rem" }}>
        <h2>Output Files</h2>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Original File</TableCell>
              <TableCell>Upload Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {outputFiles.map((outputFile) => (
              <TableRow key={outputFile._id}>
                <TableCell>{outputFile.fileName}</TableCell>
                <TableCell>{outputFile.originalFile.fileName}</TableCell>
                <TableCell>
                  {new Date(outputFile.uploadDate).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Button
                    onClick={() =>
                      handleDownload(outputFile._id, outputFile.fileName)
                    }
                  >
                    Download
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => openRenameModal(selectedFile)}>
          Rename
        </MenuItem>
        <MenuItem onClick={() => handleDeleteFile(selectedFile?._id)}>
          Delete
        </MenuItem>
        <MenuItem onClick={() => handleTestFile(selectedFile?._id)}>
          Test
        </MenuItem>
      </Menu>
      <RenameModal
        isOpen={isRenameModalOpen}
        onClose={closeRenameModal}
        onSave={handleRenameFile}
        fileName={newFileName}
        setFileName={setNewFileName}
      />
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
