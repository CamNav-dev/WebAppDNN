import { Folder } from '../models/file.model.js'; // Importing the Folder model correctly

export const createFolder = async (req, res) => {
  try {
    const { folderName, parentId } = req.body;

    // Creating a new folder instance
    const newFolder = new Folder({
      folderName,
      parentId: parentId || null, // If no parentId is provided, set it to null
    });

    // Save the folder to the database
    await newFolder.save();

    // Return success response with the new folder data
    return res.status(200).json({ message: 'Folder created successfully', folder: newFolder });
  } catch (error) {
    console.error('Error in createFolder controller:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};
