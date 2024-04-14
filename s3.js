const S3 = require('aws-sdk/clients/s3');
const fs = require('fs');
require('dotenv').config();

const region = process.env.AWS_BUCKET_REGION
const bucketName = process.env.AWS_BUCKET_NAME
const accessKeyID = process.env.AWS_BUCKET_ACCESS_KEY_ID
const secretAccessKey = process.env.AWS_BUCKET_SECRET_ACCESS_KEY

process.env.AWS_SDK_LOAD_CONFIG = 1;

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