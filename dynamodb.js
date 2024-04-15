require('dotenv').config();
const AWS = require('aws-sdk');

// Set up AWS DynamoDB client
const dynamodb = new AWS.DynamoDB.DocumentClient();

// Function to read all items from DynamoDB table
async function getAllItems(tableName) {
    const params = {
        TableName: tableName
    };

    try {
        const data = await dynamodb.scan(params).promise();
        return data.Items;
    } catch (error) {
        console.error("Unable to read items. Error:", error);
        throw new Error('Unable to read items');
    }
}

// Function to read an item by its key from DynamoDB table
async function getItemByKey(tableName, itemId) {
    console.log(itemId);
    const params = {
        TableName: tableName,
        Key: {
            'image-id': itemId
        }
    };

    try {
        const data = await dynamodb.get(params).promise();
        if (data.Item) {
            return data.Item;
        } else {
            throw new Error('Item not found');
        }
    } catch (error) {
        console.error("Unable to read item. Error:", error);
        throw new Error('Unable to read item');
    }
}

module.exports = {
    getAllItems,
    getItemByKey
};
