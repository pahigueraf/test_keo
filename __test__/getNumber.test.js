const {
  binarySearch,
  merge,
  mergeSort,
  getSmallestNumber,
  getRegisterFromDynamo,
  updateArray,
  createNewArray,
  getNumber,
} = require("../keoTest/getNumber.js");
const AWS = require("aws-sdk");
const { continuousLargestArray } = require("./data.js");
jest.mock("aws-sdk", () => {
  return {
    DynamoDB: {
      DocumentClient: jest.fn(() => ({
        put: (params) => {
          return {
            promise() {
              return true;
            },
          };
        },
        update: (params) => {
          return {
            promise() {
              return true;
            },
          };
        },
        get: (params) => {
          const keys = [
            "1b64abfd2cf864f75a94b1ed756f0af4dc872feec4af539efba8b33e585be0dfa4bcb6057f9922ccc7e8fcad80a2edd3473091477cb1ecdeb7d21873adb95d10",
            "hash",
          ];
          if (keys.includes(params.Key.id)) {
            return {
              promise() {
                return {
                  Item: {
                    id: "id1",
                    smallest: 1,
                    counterNumber: 3,
                  },
                };
              },
            };
          } else
            return {
              promise() {
                return {};
              },
            };
        },
      })),
    },
  };
});

describe("testing binary search", () => {
  test("trying ", () => {
    const array = [1, 2, 3];
    const result = binarySearch(array, 0, array.length);
    expect(result).toBe(4);
  });
});

describe("testing merge", () => {
  test("trying ", () => {
    const array = [150, 2, -5, 10];
    let middle = Math.floor(array.length / 2);
    merge(array, 0, middle, array.length - 1);
    expect(array).toEqual([10, 150, 2, -5]);
  });
});

describe("testing mergesort", () => {
  test("trying ", () => {
    const array = [150, 2, -5, 10];
    mergeSort(array, 0, array.length - 1);
    expect(array).toEqual([-5, 2, 10, 150]);
  });
});

describe("getSmallestNumber", () => {
  test("trying ", () => {
    const array = [150, 2, -5, 10];
    const result = getSmallestNumber(array);
    expect(result).toBe(1);
  });
  test("trying ", () => {
    const array = [150, 1, -5, 10];
    const result = getSmallestNumber(array);
    expect(result).toBe(2);
  });
  test("trying ", () => {
    const array = [-5, -5, -5, -10];
    const result = getSmallestNumber(array);
    expect(result).toBe(1);
  });
  test("trying ", () => {
    const array = [-5, -5, -5, -5];
    const result = getSmallestNumber(array);
    expect(result).toBe(1);
  });
  test("trying ", () => {
    const array = [];
    const result = getSmallestNumber(array);
    expect(result).toBe(1);
  });
  test("trying ", () => {
    const array = [-5, -5, -5, "hola"];
    const result = getSmallestNumber(array);
    expect(result).toBe(-1);
  });
});

describe("testing getRegisterFromDynamo", () => {
  test("trying ", async () => {
    const result = await getRegisterFromDynamo(
      "hash",
      new AWS.DynamoDB.DocumentClient()
    );
    expect(result).toHaveProperty("Item");
  });
});

describe("testing updateArray", () => {
  test("trying ", async () => {
    const result = await updateArray("hash", new AWS.DynamoDB.DocumentClient());
    expect(result).toBe(true);
  });
});

describe("testing createNewArray", () => {
  test("trying ", async () => {
    const result = await createNewArray(
      "hash",
      1,
      new AWS.DynamoDB.DocumentClient()
    );
    expect(result).toBe(true);
  });
});

describe("testing getNumber", () => {
  test("error ", async () => {
    const result = await getNumber({
      body: JSON.stringify({ array: [-5, -5, -5, "hola"] }),
    });
    expect(result).toEqual({
      statusCode: 401,
      body: JSON.stringify({
        error:
          "Cannot process this array. There is a NaN element or a number out of the range",
      }),
    });
  });
  test("trying ", async () => {
    const result = await getNumber({
      body: JSON.stringify({ array: [150, 2, -5, 10] }),
    });
    expect(result).toEqual({
      statusCode: 200,
      body: JSON.stringify({
        result: 1,
      }),
    });
  });

  test("error length ", async () => {
    const result = await getNumber({
      body: JSON.stringify({ array: continuousLargestArray }),
    });
    expect(result).toEqual({
      statusCode: 401,
      body: JSON.stringify({
        error: "Cannot process this array by max length",
      }),
    });
  });

  test("error ", async () => {
    const result = await getNumber({
      body: JSON.stringify({ array: [-5, -5, -5, 1000001] }),
    });
    expect(result).toEqual({
      statusCode: 401,
      body: JSON.stringify({
        error:
          "Cannot process this array. There is a NaN element or a number out of the range",
      }),
    });
  });

  test("error ", async () => {
    const result = await getNumber({
      body: JSON.stringify({ array: -5 }),
    });
    expect(result).toEqual({
      statusCode: 401,
      body: JSON.stringify({
        error:
          "The body must have a property called 'array' and the value must be an array",
      }),
    });
  });

  test("error ", async () => {
    const result = await getNumber({
      body: JSON.stringify({ arrayTest: -5 }),
    });
    expect(result).toEqual({
      statusCode: 401,
      body: JSON.stringify({
        error:
          "The body must have a property called 'array' and the value must be an array",
      }),
    });
  });
});
