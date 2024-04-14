const S3 = require('aws-sdk/clients/s3');
const fs = require('fs');
require('dotenv').config();

const region = "ap-south-1"
const bucketName = "awadhoot-image-detector"
const accessKeyID = 'AKIAVNULFPIV5AFEIMD2'
const secretAccessKey = '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'

const s3 = new S3({
    region,
    accessKeyID,
    secretAccessKey
});

function uploadFile(file) {
    // file is multer object
    const fileStream = fs.createReadStream(file.path);

    const uploadParams = {
        Bucket: bucketName,
        Body: fileStream,
        Key: file.filename
    }

    return s3.upload(uploadParams).promise();
}

exports.uploadFile = uploadFile;