require('dotenv').config();

const express = require('express');
const multer = require('multer');
const cors = require('cors');
const bodyParser = require('body-parser');
const { uploadFile } = require('./s3.js');
const { getAllItems, getItemByKey } = require('./dynamodb.js');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Set up multer storage for storing uploaded files in memory
const storage = multer.memoryStorage();

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

app.get('/all-images', async (req, res) => {
    try {
        const allItems = await getAllItems('image-stats');
        if (!allItems) {
            return res.status(400).send('Some error while getting all images.');
        }

        return res.status(200).json({ images: allItems });

    } catch (error) {
        return res.status(400).send('Some error occurred while getting all images.');
    }
});

app.get('/image/:imageID', async (req, res) => {
    try {
        const item = await getItemByKey('image-stats', req.params.imageID);
        if (!item) {
            return res.status(400).send('Some error while getting all images.');
        }

        return res.status(200).json({ image: item });
    } catch (error) {
        return res.status(400).send('Some error occurred while getting specified images.');
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
