'use strict';

/*
 * A middleware to wrap some comman middlwares. So all function will have these middlewares automatically.
 */
const middy = require('middy');
const {
  cors, functionShield, ssm, doNotWaitForEmptyEventLoop,
} = require('middy/middlewares');

const { STAGE } = process.env;

module.exports = func => middy(func)
  .use(cors({
    origin: '*',
    credentials: true,
  }))
  .use(ssm({
    cache: true,
    cacheExpiryInMillis: 3 * 60 * 1000,
    setToContext: true, // Save the parameters to context instead of env. The parameters will just live in memory for the security concern.
    names: {
      redisHost: `/cs687/${STAGE}/redis-host`,
      redisPort: `/cs687/${STAGE}/redis-port`,
      redisPassword: `/cs687/${STAGE}/redis-password`,
      FUNCTION_SHIELD_TOKEN: `/cs687/${STAGE}/function_shield_token`,
    },
  }))
  .use(functionShield({
    policy: {
      outbound_connectivity: 'alert',
      read_write_tmp: 'block',
      create_child_process: 'block',
      read_handler: 'block',
    },
  }))
  .use(doNotWaitForEmptyEventLoop());
