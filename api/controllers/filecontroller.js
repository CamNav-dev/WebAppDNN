import UploadedFile from '../models/file.model.js';

// Helper function to validate if the file is an Excel file
const isExcelFile = (fileType) => {
  return fileType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
         fileType === 'application/vnd.ms-excel';
};

export const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { originalname, mimetype, buffer } = req.file;

    // Validate file type
    if (!isExcelFile(mimetype)) {
      return res.status(400).json({ message: 'Invalid file type. Only Excel files are allowed.' });
    }

    // Create a new file record in the database
    const newFile = new UploadedFile({
      fileName: originalname,
      fileType: mimetype,
      fileData: buffer,
      uploadedBy: req.user._id,
    });
    await newFile.save();

    return res.status(200).json({ message: 'File uploaded successfully', file: newFile });
  } catch (error) {
    console.error('Error in uploadFile controller:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};