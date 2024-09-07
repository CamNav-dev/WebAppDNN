import mongoose from 'mongoose';

const outputDocumentSchema = new mongoose.Schema({
  fileName: {
    type: String,
    required: true
  },
  fileData: {
    type: Buffer,
    required: true
  },
  fileType: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.nows
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  originalFile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UploadedFile',
    required: true
  }
});

const OutputDocument = mongoose.model('OutputDocument', outputDocumentSchema);

export default OutputDocument;