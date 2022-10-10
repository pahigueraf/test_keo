<!--
title: 'AWS Simple HTTP Endpoint example in NodeJS'
description: 'This template demonstrates how to make a simple HTTP API with Node.js running on AWS Lambda and API Gateway using the Serverless Framework.'
layout: Doc
framework: v3
platform: AWS
language: nodeJS
authorLink: 'https://github.com/serverless'
authorName: 'Serverless, inc.'
authorAvatar: 'https://avatars1.githubusercontent.com/u/13742415?s=200&v=4'
-->

# KeoTest: Serverless Framework Node HTTP API on AWS

This template demonstrates how to make a simple HTTP API with Node.js running on AWS Lambda and API Gateway using the Serverless Framework.

## Usage

You must have installed Serverless to deploy the services on AWS.

```
$ npm install -g serverless
```

### Deployment

This code has been tested with the 16.17.1 node version.
You must move on the keoTest folder to run the serverless.yml file.

You need an AWS account and configure a serverless user. The next command have step by step instructions to achieve it.

```
$ cd keoTest
$ serverless deploy
```

After deploying, you should see output similar to:

```bash
Deploying keoTest to stage dev (us-east-1)

✔ Service deployed to stack keoTest-dev (152s)

endpoints:
  POST - https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/smallest
  GET - https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/stats/{number}
functions:
  getNumber: keoTest-dev-getNumber (3.8 kB)
  getStats: keoTest-dev-getStats (3.8 kB)
```

_Note_: In current form, after deployment, your API is public and can be invoked by anyone. For production deployments, you might want to configure an authorizer. For details on how to do that, refer to [http event docs](https://www.serverless.com/framework/docs/providers/aws/events/apigateway/).

### Invocation

After successful deployment, you can call the created application via HTTP:

```bash
curl --location --request GET 'https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/stats/0'
```

Which should result in response similar to the following (removed `input` content for brevity):

```json
{
  "count": 0,
  "total": 0,
  "ratio": 0.0
}
```

```bash
curl --location --request POST 'https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/smallest' \
--header 'Content-Type: application/json' \
--data-raw '{
    "array": [1,2,3]
}'
```

```json
{
  "result": 4
}
```
