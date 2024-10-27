import mongoose from "mongoose";
const uploadedFileSchema = new mongoose.Schema({
  fileName: {
    type: String,
    required: true,
  },
  fileType: {
    type: String,
    required: true,
  },
  fileData: {
    type: Buffer,
    required: true,
  },
  folderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Folder',
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  uploadDate: {
    type: Date,
    default: Date.now,
  },
});

const folderSchema = new mongoose.Schema({
  folderName: {
    type: String,
    required: true,
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Folder',
  },
  createdDate: {
    type: Date,
    default: Date.now,
  }
});

const UploadedFile = mongoose.model('UploadedFile', uploadedFileSchema);
const Folder = mongoose.model('Folder', folderSchema);

export { UploadedFile, Folder };
