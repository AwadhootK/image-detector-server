const S3 = require('aws-sdk/clients/s3');
const fs = require('fs');
require('dotenv').config();

const region = process.env.AWS_BUCKET_REGION
const bucketName = process.env.AWS_BUCKET_NAME
const accessKeyID = process.env.AWS_BUCKET_ACCESS_KEY_ID
const secretAccessKey = process.env.AWS_BUCKET_SECRET_ACCESS_KEY

const s3 = new S3({
    region: process.env.AWS_BUCKET_REGION,
    accessKeyId: process.env.AWS_BUCKET_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_BUCKET_SECRET_ACCESS_KEY
});

function uploadFile(file) {

    const uploadParams = {
        Bucket: bucketName,
        Body: file.buffer,
        Key: file.originalname
    }

    return s3.upload(uploadParams).promise();
}

exports.uploadFile = uploadFile;