'use strict';

const log = require('@kevinwang0316/log');
const cloudwatch = require('@kevinwang0316/cloudwatch');
const {
  createClient, getAsync, setAsync, quit,
} = require('@kevinwang0316/redis-helper');

const wrapper = require('../middlewares/wrapper');

const handler = async (event, context) => {
  createClient(context.redisHost, context.redisPort, context.redisPassword);
  const cachedHexagrams = await cloudwatch.trackExecTime('RedisGetLatency', () => getAsync(event.queryStringParameters.language));
  quit();
  return { statusCode: 200, body: cachedHexagrams };
};

module.exports.handler = wrapper(handler);
