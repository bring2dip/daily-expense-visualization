const path = require('path'),
  constants = require(path.resolve('./lib/constants')),
  monthAggregator = require('./month'),
  debug = require('debug')('expense:aggregators:year'),
  helpers = require(path.resolve('./lib/helpers'));

/**
* Total annual expense
*/
module.exports = (expenseObj) => {
  const aggregates = monthAggregator(expenseObj);
  let yearTotal = 0;
  for (let month in aggregates) {
    yearTotal += aggregates[month].total;
  }
  return { yearTotal };
};
