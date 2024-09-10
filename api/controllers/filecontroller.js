import { UploadedFile } from '../models/file.model.js';
import OutputDocument from '../models/ouput.model.js';
import path from 'path'; // Import the path module
import {spawn} from 'child_process'
import { PassThrough } from 'stream';
import officegen from 'officegen';
import fs from 'fs';

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

// Update file name
export const updateFileName = async (req, res) => {
  const { fileId, newFileName } = req.body;

  try {
    // Encuentra el archivo en la base de datos usando el ID
    const file = await UploadedFile.findById(fileId);

    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Actualiza el nombre del archivo
    file.fileName = newFileName;
    await file.save();

    return res.status(200).json({ message: 'File name updated successfully', file });
  } catch (error) {
    console.error('Error updating file name:', error);
    return res.status(500).json({ message: 'Server error', error });
  }
};

// Delete file
export const deleteFile = async (req, res) => {
  try {
    const { fileId } = req.params;

    const file = await UploadedFile.findById(fileId);

    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    await file.deleteOne(); // Use deleteOne() to remove the document

    return res.status(200).json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('Error in deleteFile controller:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getAllFiles = async (req, res) => {
  try {
    // Retrieve all files from the database
    const files = await UploadedFile.find().populate('uploadedBy', 'username'); // Adjust based on your schema
    return res.status(200).json(files);
  } catch (error) {
    console.error('Error fetching files:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getFiles = async (req, res) => {
  try {
    // Retrieve all files from the database
    const userId = req.user._id;
    console.log(userId);
    const files = await UploadedFile.find({uploadedBy: userId}).populate('uploadedBy', 'username'); // Adjust based on your schema
    return res.status(200).json(files);
  } catch (error) {
    console.error('Error fetching files:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const testFile = async (req, res) => {
  try {
    const { fileId } = req.params;
    const file = await UploadedFile.findById(fileId);

    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    const fileBuffer = Buffer.from(file.fileData.buffer);

    const pythonScriptPath = path.resolve('C:\\DNNWebApp\\api\\model\\dnn_model.py.py');

    console.log(`Executing Python script: ${pythonScriptPath}`);

    // lanzar el proceso de Python y envía el contenido del archivo (guardado en MongoDB como un Buffer) a través de stdin
    const pythonProcess = spawn('python', [pythonScriptPath], {
      env: { ...process.env, PYTHONIOENCODING: 'utf-8' }
    });

    pythonProcess.stdin.write(fileBuffer);
    pythonProcess.stdin.end();

    let pythonOutput = '';
    let pythonError = '';

    // script de Python genera una salida que es capturada por el backend
    pythonProcess.stdout.on('data', (data) => {
      console.log(`Python stdout: ${data}`);
      pythonOutput += data.toString('utf-8');
    });

    pythonProcess.stderr.on('data', (data) => {
      console.error(`Python stderr: ${data}`);
      pythonError += data.toString('utf-8');
    });

    // Handle the completion of the Python script
    await new Promise((resolve, reject) => {
      pythonProcess.on('close', async (code) => {
        console.log(`Python process exited with code ${code}`);
        if (code !== 0) {
          console.error(`Python script error: ${pythonError}`);
          reject(new Error(pythonError));
          return;
        }
        console.log(`Python script output: ${pythonOutput}`);

        try {
          // Utiliza el paquete officegen para crear un documento de Word
          const docx = officegen('docx');
          // Se inserta el texto del resultado del script de Python (pythonOutput) en el documento como un párrafo.
          const pObj = docx.createP();
          pObj.addText(pythonOutput);

          // utiliza un stream (PassThrough) para capturar el contenido del documento en un Buffer
          const passThroughStream = new PassThrough();
          const chunks = [];
          
          passThroughStream.on('data', (chunk) => {
            chunks.push(chunk);
          });

          passThroughStream.on('end', async () => {
            const wordBuffer = Buffer.concat(chunks);

            // Save the Word document to MongoDB
            const outputDocument = new OutputDocument({
              fileName: `${file.fileName}_output.docx`,
              fileData: wordBuffer,
              fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
              uploadedBy: req.user._id,
              originalFile: file._id
            });

            await outputDocument.save();

            resolve({
              message: 'File processed successfully',
              output: pythonOutput,
              outputDocumentId: outputDocument._id
            });
          });

          docx.generate(passThroughStream);
          
        } catch (error) {
          reject(error);
        }
      });
    });

    const result = await new Promise((resolve) => pythonProcess.on('close', resolve));
    return res.status(200).json(result);

  } catch (error) {
    console.error('Error in testFile controller:', error.stack);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};
export const getOutputDocument = async (req, res) => {
  try {
    const { documentId } = req.params;
    const outputDocument = await OutputDocument.findById(documentId);

    if (!outputDocument) {
      return res.status(404).json({ message: 'Output document not found' });
    }

    // Set a default Content-Type if it's not available in the document
    const contentType = outputDocument.fileType || 'application/octet-stream';

    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${outputDocument.fileName}"`);
    
    // Check if fileData exists and is a Buffer
    if (outputDocument.fileData && Buffer.isBuffer(outputDocument.fileData)) {
      res.send(outputDocument.fileData);
    } else {
      throw new Error('File data is missing or invalid');
    }

  } catch (error) {
    console.error('Error in getOutputDocument controller:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getOutputFiles = async (req, res) => {
  try {
    const userId = req.user._id;
    const outputDocuments = await OutputDocument.find({uploadedBy: userId})
      .populate('uploadedBy', 'username')
      .populate('originalFile', 'fileName');
    return res.status(200).json(outputDocuments);
  } catch (error) {
    console.error('Error fetching output files:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};