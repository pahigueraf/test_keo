const { getStats, getTotal, getCount } = require("../keoTest/getStats.js");
const AWS = require("aws-sdk");
jest.mock("aws-sdk", () => {
  return {
    DynamoDB: {
      DocumentClient: jest.fn(() => ({
        scan: (params) => {
          const score = params.ExpressionAttributeValues
            ? params.ExpressionAttributeValues[":score"]
            : 0;
          return {
            promise() {
              const Items = [
                {
                  id: "id1",
                  smallest: 1200,
                  counterNumber: 3,
                },
                {
                  id: "id2",
                  smallest: 120,
                  counterNumber: 4,
                },
              ];
              return {
                Items: Items.filter((element) =>
                  score == 0 ? element : element.smallest == score
                ),
              };
            },
          };
        },
      })),
    },
  };
});

describe("testing getCount", () => {
  test("trying ", async () => {
    const result = await getCount(1200, new AWS.DynamoDB.DocumentClient());
    expect(result).toBe(3);
  });
});

describe("testing getTotal", () => {
  test("trying ", async () => {
    const result = await getTotal(new AWS.DynamoDB.DocumentClient());
    expect(result).toBe(7);
  });
});

describe("testing getStats", () => {
  test("trying ", async () => {
    const result = await getStats({
      pathParameters: {
        number: 120,
      },
    });
    expect(result).toEqual({
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        count: 4,
        total: 7,
        ratio: 0.57,
      }),
    });
  });
  test("error ", async () => {
    const result = await getStats({
      pathParameters: {
        number: "hola",
      },
    });
    expect(result).toEqual({
      statusCode: 401,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        error: "Cannot get stats for a NaN type",
      }),
    });
  });
});
