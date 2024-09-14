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

    // Ruta a tu script de Python
    const pythonScriptPath = path.resolve("C:\\DNNWebApp\\api\\model\\dnn_model.py.py");

    console.log(`Ejecutando script de Python: ${pythonScriptPath}`);

    // Iniciar el proceso de Python
    const pythonProcess = spawn('python', [pythonScriptPath], {
      env: { ...process.env, PYTHONIOENCODING: 'utf-8' }
    });

    // Enviar el archivo a Python a través de stdin
    pythonProcess.stdin.write(fileBuffer);
    pythonProcess.stdin.end();

    let pythonOutput = Buffer.from([]);

    // Capturar la salida binaria del script de Python
    pythonProcess.stdout.on('data', (data) => {
      pythonOutput = Buffer.concat([pythonOutput, data]);
    });

    // Capturar los errores del script de Python
    pythonProcess.stderr.on('data', (data) => {
      console.error(`Error de Python: ${data.toString()}`);
    });

    // Manejar la finalización del proceso de Python
    pythonProcess.on('close', async (code) => {
      console.log(`Proceso de Python terminó con código ${code}`);

      if (code !== 0) {
        return res.status(500).json({ message: 'Error en el proceso de Python' });
      }

      try {
        // Guardar el documento generado en MongoDB
        const outputDocument = new OutputDocument({
          fileName: `${file.fileName}_output.docx`,
          fileData: pythonOutput,  // Aquí se guarda el archivo Word generado
          fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          uploadedBy: req.user._id,
          originalFile: file._id
        });

        await outputDocument.save();

        // Responder al cliente con el ID del documento
        return res.status(200).json({
          message: 'Archivo procesado correctamente',
          outputDocumentId: outputDocument._id
        });
      } catch (error) {
        console.error('Error al guardar el documento en MongoDB:', error);
        return res.status(500).json({ message: 'Error al guardar el archivo' });
      }
    });
  } catch (error) {
    console.error('Error en el controlador testFile:', error.stack);
    return res.status(500).json({ message: 'Error del servidor', error: error.message });
  }
};

export const getOutputDocument = async (req, res) => {
  try {
    const { documentId } = req.params;
    const outputDocument = await OutputDocument.findById(documentId);

    if (!outputDocument) {
      return res.status(404).json({ message: 'Documento de salida no encontrado' });
    }

    // Establecer el tipo de contenido para la descarga del archivo
    const contentType = outputDocument.fileType || 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${outputDocument.fileName}"`);

    // Comprobar si los datos del archivo existen y si son de tipo Buffer
    if (outputDocument.fileData && Buffer.isBuffer(outputDocument.fileData)) {
      res.send(outputDocument.fileData);
    } else {
      throw new Error('Datos del archivo no válidos o faltantes');
    }
  } catch (error) {
    console.error('Error en el controlador getOutputDocument:', error);
    res.status(500).json({ message: 'Error del servidor', error: error.message });
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