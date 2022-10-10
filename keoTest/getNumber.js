"use strict";
const AWS = require("aws-sdk");
const crypto = require("crypto");

async function getNumber(event) {
  console.log(event);
  try {
    const dynamoDb = new AWS.DynamoDB.DocumentClient();
    console.time("start");
    const body = JSON.parse(event.body);
    if (body.array.length > 100000)
      throw "Cannot process this array by max length";
    const hash = crypto.createHash("sha512");
    const data = hash.update(JSON.stringify(body.array), "utf-8");
    const generatedHash = data.digest("hex");
    const result = await getRegisterFromDynamo(generatedHash, dynamoDb);
    let number = 0;
    if (!result.Item) {
      number = getSmallestNumber(body.array);
      if (number === -1)
        throw "Cannot process this array. There is a NaN element or a number out of the range";
      await createNewArray(generatedHash, number, dynamoDb);
    } else {
      number = result.Item.smallest;
      await updateArray(generatedHash, dynamoDb);
    }
    console.timeEnd("start");
    return {
      statusCode: 200,
      body: JSON.stringify({
        result: number,
      }),
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 401,
      body: JSON.stringify({
        error,
      }),
    };
  }
}

async function createNewArray(generatedHash, number, dynamoDb) {
  const putParams = {
    TableName: process.env.DYNAMODB_COUNTER_TABLE,
    Item: {
      id: generatedHash,
      smallest: number,
      counterNumber: 1,
    },
  };
  return await dynamoDb.put(putParams).promise();
}

async function updateArray(generatedHash, dynamoDb) {
  const putParams = {
    TableName: process.env.DYNAMODB_COUNTER_TABLE,
    Key: {
      id: generatedHash,
    },
    UpdateExpression: `add #incremented :value`,
    ExpressionAttributeNames: {
      "#incremented": "counterNumber",
    },
    ExpressionAttributeValues: {
      ":value": 1,
    },
  };
  return await dynamoDb.update(putParams).promise();
}

async function getRegisterFromDynamo(generatedHash, dynamoDb) {
  const getParams = {
    TableName: process.env.DYNAMODB_COUNTER_TABLE,
    Key: {
      id: generatedHash,
    },
  };
  const result = await dynamoDb.get(getParams).promise();
  return result;
}

function getSmallestNumber(array) {
  let hasNaNElement = false;
  if (array.length == 0) return 1;
  else
    array = array.filter((element) => {
      if (isNaN(element) || +element > 1000000 || +element < -1000000)
        hasNaNElement = true;
      else if (element > 0) return element;
    });
  if (hasNaNElement) return -1;
  if (array.length == 0) return 1;
  else {
    array = [...new Set(array)];
    mergeSort(array, 0, array.length - 1);
    if (array[0] != 1) return 1;
    return binarySearch(array, 0, array.length - 1);
  }
}
// tomado de https://big-o.io/algorithms/comparison/merge-sort/
function mergeSort(array, start, end) {
  if (start < end) {
    let middle = Math.floor((start + end) / 2);
    mergeSort(array, start, middle);
    mergeSort(array, middle + 1, end);
    merge(array, start, middle, end);
  }
}
// tomado de https://big-o.io/algorithms/comparison/merge-sort/
function merge(array, start, middle, end) {
  let leftArrayLength = middle - start + 1;
  let rightArrayLength = end - middle;
  let leftArray = [];
  let rightArray = [];
  for (let i = 0; i < leftArrayLength; ++i) leftArray[i] = array[start + i];
  for (let i = 0; i < rightArrayLength; ++i)
    rightArray[i] = array[middle + 1 + i];

  let leftIndex = 0,
    rightIndex = 0;
  let currentIndex = start;
  while (leftIndex < leftArrayLength && rightIndex < rightArrayLength) {
    if (leftArray[leftIndex] <= rightArray[rightIndex])
      array[currentIndex] = leftArray[leftIndex++];
    else array[currentIndex] = rightArray[rightIndex++];
    currentIndex++;
  }
  while (leftIndex < leftArrayLength)
    array[currentIndex++] = leftArray[leftIndex++];
  while (rightIndex < rightArrayLength)
    array[currentIndex++] = rightArray[rightIndex++];
}
// modificado de https://www.geeksforgeeks.org/binary-search-in-javascript/
function binarySearch(arr, start, end) {
  if (start > end) return arr[arr.length - 1] + 1;
  let mid = Math.floor((start + end) / 2);
  if (arr[mid] == mid + 1 && arr[mid + 1] != mid + 2) return mid + 2;
  if (arr[mid] > mid + 1) return binarySearch(arr, start, mid - 1);
  else return binarySearch(arr, mid + 1, end);
}

module.exports = {
  binarySearch,
  merge,
  mergeSort,
  getSmallestNumber,
  getNumber,
  createNewArray,
  updateArray,
  getRegisterFromDynamo,
};
