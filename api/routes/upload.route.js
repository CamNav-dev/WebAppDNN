// backend/routes/upload.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();

// Configure Multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// File validation
const fileFilter = (req, file, cb) => {
    const filetypes = /xlsx|xls/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Excel Files Only!');
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter
}).single('file');

// Upload route
router.post('/upload', (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            return res.status(400).json({ message: err });
        }
        res.status(200).json({ message: 'File uploaded successfully', file: req.file });
    });
});

module.exports = router;
