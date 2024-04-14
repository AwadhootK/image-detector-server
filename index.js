require('dotenv').config();

const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors'); 

const { uploadFile } = require('./s3.js');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// Set up multer storage for storing uploaded files
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'images');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

app.get('/ping', (req, res) => res.status(200).send('Pong!'));

const upload = multer({ storage: storage });

// Endpoint for uploading image
app.post('/upload-image', upload.single('image'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    const file = req.file;
    const response = await uploadFile(file);

    console.log(response);
    if (!response) {
        return res.status(400).send('Some error while uploading to S3.');
    }

    // File uploaded successfully
    return res.status(200).send('File uploaded successfully.');
});

// Create images directory if it doesn't exist
const imagesDir = path.join(__dirname, 'images');
if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir);
}

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
