const path = require('path'),
  constants = require(path.resolve('./lib/constants')),
  aggregators = require(path.resolve('./lib/aggregators')),
  debug = require('debug')('expense:aggregators:year');
  helpers = require(path.resolve('./lib/helpers')),

  /**
  * Total annual expense
  */
  exports.yearAggregator = (expenseObj) => {
    const aggregates = aggregators.monthAggregator(expenseObj);
    let yearTotal = 0;
    for (let month in aggregates) {
      yearTotal += aggregates[month].total;
    }
    return { yearTotal };
  }
