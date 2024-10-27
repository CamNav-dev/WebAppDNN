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
  Checkbox,
  CircularProgress,
  Alert,
  Snackbar,
  Box,
  TableSortLabel,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  PlayArrow as PlayArrowIcon,
  GetApp as GetAppIcon,
} from "@mui/icons-material";
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
  const [orderBy, setOrderBy] = useState("uploadDate");
  const [order, setOrder] = useState("desc");
  const [testingFile, setTestingFile] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  useEffect(() => {
    setFiles(initialFiles);
    setOutputFiles(initialOutputFiles);
  }, [initialFiles, initialOutputFiles]);

  const handleSort = (property, isOutputFiles = false) => {
    const isAsc = orderBy === property && order === "asc";
    const newOrder = isAsc ? "desc" : "asc";
    setOrder(newOrder);
    setOrderBy(property);

    const comparator = (a, b) => {
      if (property === "uploadDate") {
        return isAsc
          ? new Date(a[property]) - new Date(b[property])
          : new Date(b[property]) - new Date(a[property]);
      }
      return isAsc
        ? a[property].localeCompare(b[property])
        : b[property].localeCompare(a[property]);
    };

    if (isOutputFiles) {
      const sortedOutputFiles = [...outputFiles].sort(comparator);
      setOutputFiles(sortedOutputFiles);
    } else {
      const sortedFiles = [...files].sort(comparator);
      setFiles(sortedFiles);
    }
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
  };

  const handleRenameFile = async () => {
    try {
      const endpoint = fileToRename.originalFile ? "/api/files/update-output" : "/api/files/update";
      await axios.put(
        endpoint,
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
      setSnackbar({
        open: true,
        message: "File renamed successfully",
        severity: "success",
      });
    } catch (error) {
      console.error("Error updating file name:", error);
      setSnackbar({
        open: true,
        message: "Failed to rename file. Please try again.",
        severity: "error",
      });
    }
  };

  const handleDeleteFile = async (fileId, isOutputFile = false) => {
    try {
      const endpoint = isOutputFile ? `/api/files/delete-output/${fileId}` : `/api/files/delete/${fileId}`;
      await axios.delete(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (typeof onFileUpdate === "function") {
        onFileUpdate();
      }
      if (typeof onOutputFileUpdate === "function") {
        onOutputFileUpdate();
      }
      setSnackbar({
        open: true,
        message: "File deleted successfully",
        severity: "success",
      });
    } catch (error) {
      console.error("Error deleting file:", error);
      setSnackbar({
        open: true,
        message: "Failed to delete file. Please try again.",
        severity: "error",
      });
    }
  };

  const handleTestFile = async (fileId) => {
    setTestingFile(fileId);
    try {
      const response = await axios.post(
        `/api/files/test/${fileId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (typeof onOutputFileUpdate === "function") {
        onOutputFileUpdate();
      }
      setSnackbar({
        open: true,
        message: "File tested successfully",
        severity: "success",
      });
    } catch (error) {
      console.error("Error testing file:", error);
      setSnackbar({
        open: true,
        message: "An error occurred while testing the file.",
        severity: "error",
      });
    }
    setTestingFile(null);
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

  if (loading) return <CircularProgress />;
  if (error && error.response?.status === 403) {
    return <Alert severity="error">You are not authorized to view these files. Please log in again.</Alert>;
  }
  if (error) return <Alert severity="error">{error.message}</Alert>;

  return (
    <Box sx={{ mb: 8 }}>
      <TableContainer component={Paper} sx={{ mb: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Owner</TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "uploadDate"}
                  direction={order}
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
                <TableCell>{file.fileName}</TableCell>
                <TableCell>{file.uploadedBy.username}</TableCell>
                <TableCell>
                  {new Date(file.uploadDate).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => openRenameModal(file)} color="secondary">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteFile(file._id)} color="error">
                    <DeleteIcon />
                  </IconButton>
                  <IconButton onClick={() => handleTestFile(file._id)} color="primary">
                    <PlayArrowIcon />
                  </IconButton>
                  {testingFile === file._id && <CircularProgress size={24} />}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Original File</TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "uploadDate"}
                  direction={order}
                  onClick={() => handleSort("uploadDate", true)}
                >
                  Upload Date
                </TableSortLabel>
              </TableCell>
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
                  <IconButton onClick={() => handleDownload(outputFile._id, outputFile.fileName)} color="primary">
                    <GetAppIcon />
                  </IconButton>
                  <IconButton onClick={() => openRenameModal(outputFile)} color="secondary">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteFile(outputFile._id, true)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
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
    </Box>
  );
}