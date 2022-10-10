"use strict";
const AWS = require("aws-sdk");

async function getStats(event) {
  console.log(event);
  try {
    const dynamoDb = new AWS.DynamoDB.DocumentClient();
    const id = +event.pathParameters.number;
    if (isNaN(id)) throw "Cannot get stats for a NaN type";
    const count = await getCount(id, dynamoDb);
    const total = await getTotal(dynamoDb);
    const ratio = +(count / total).toPrecision(2);

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        count,
        total,
        ratio,
      }),
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 401,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        error,
      }),
    };
  }
}

async function getCount(number, dynamoDb) {
  const scanParams = {
    TableName: process.env.DYNAMODB_COUNTER_TABLE,
    ScanIndexForward: true,
    FilterExpression: "#number = :score",
    ExpressionAttributeNames: {
      "#number": "smallest",
    },
    ExpressionAttributeValues: {
      ":score": number,
    },
  };
  const result = await dynamoDb.scan(scanParams).promise();
  return result.Items.reduce(
    (actual, array) => actual + array.counterNumber,
    0
  );
}

async function getTotal(dynamoDb) {
  const scanParams = {
    TableName: process.env.DYNAMODB_COUNTER_TABLE,
  };
  const result = await dynamoDb.scan(scanParams).promise();
  return result.Items.reduce(
    (actual, array) => actual + array.counterNumber,
    0
  );
}

module.exports = { getCount, getStats, getTotal };
