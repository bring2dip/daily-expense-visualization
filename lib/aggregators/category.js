const path = require('path'),
  constants = require(path.resolve('./lib/constants')),
  debug = require('debug')('expense:aggregators:category'),
  categoryBase = require('./category-base'),
  helpers = require(path.resolve('./lib/helpers'));
/**
* Categorizes expenses
* categorize into every word in the expense sheet
*/
module.exports =  (expenseObj) => {
  const categories = categoryBase(expenseObj);
  return categories;
};
