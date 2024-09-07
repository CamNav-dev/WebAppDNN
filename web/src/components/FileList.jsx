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
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import RenameModal from "./RenameFile";

export default function FileList({ files: initialFiles, loading, error, onFileUpdate }) {
  const token = useSelector((state) => state.user.currentUser?.token);
  const [files, setFiles] = useState(initialFiles);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [fileToRename, setFileToRename] = useState(null);
  const [newFileName, setNewFileName] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [orderBy, setOrderBy] = useState('uploadDate');
  const [order, setOrder] = useState('desc');
  const [testingFile, setTestingFile] = useState(null);
  const [testResult, setTestResult] = useState(null);


  useEffect(() => {
    setFiles(initialFiles);
  }, [initialFiles]);

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
    const sortedFiles = [...files].sort((a, b) => {
      if (property === 'uploadDate') {
        return isAsc ? new Date(a[property]) - new Date(b[property]) : new Date(b[property]) - new Date(a[property]);
      }
      return isAsc ? a[property].localeCompare(b[property]) : b[property].localeCompare(a[property]);
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
    } catch (error) {
      console.error("Error testing file:", error);
      setTestResult({ error: 'An error occurred while testing the file.' });
    }
    setTestingFile(null);
    handleMenuClose();
  };

  const handleDownload = async (documentId) => {
    try {
      const response = await axios.get(`/api/files/output/${documentId}`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob',
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'output.docx');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading output document:', error);
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
  if (error) return <div>Error: {error}</div>;

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell padding="checkbox">
              <Checkbox />
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={orderBy === 'fileName'}
                direction={orderBy === 'fileName' ? order : 'asc'}
                onClick={() => handleSort('fileName')}
              >
                Name
              </TableSortLabel>
            </TableCell>
            <TableCell>Owner</TableCell>
            <TableCell>
              <TableSortLabel
                active={orderBy === 'uploadDate'}
                direction={orderBy === 'uploadDate' ? order : 'asc'}
                onClick={() => handleSort('uploadDate')}
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
              <TableCell>{new Date(file.uploadDate).toLocaleDateString()}</TableCell>
              <TableCell>
                <IconButton onClick={(event) => handleMenuOpen(event, file)}>
                  <MoreVertIcon />
                </IconButton>
                {testingFile === file._id && <CircularProgress size={24} />}
                {testResult && testResult.outputDocumentId && selectedFile?._id === file._id && (
                  <Button onClick={() => handleDownload(testResult.outputDocumentId)}>
                    Download Output
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => openRenameModal(selectedFile)}>Rename</MenuItem>
        <MenuItem onClick={() => handleDeleteFile(selectedFile?._id)}>Delete</MenuItem>
        <MenuItem onClick={() => handleTestFile(selectedFile?._id)}>Test</MenuItem>
      </Menu>
      <RenameModal
        isOpen={isRenameModalOpen}
        onClose={closeRenameModal}
        onSave={handleRenameFile}
        fileName={newFileName}
        setFileName={setNewFileName}
      />
    </TableContainer>
  );
}