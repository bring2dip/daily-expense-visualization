const path = require('path'),
  parser = require(path.resolve('lib/parser')),
  aggregators = require(path.resolve('lib/aggregators')),
  helpers = require(path.resolve('lib/helpers'));


const file = path.resolve('data/sample-data.txt');

parser.fileParser(file).then((expenseObj) => {
  //console.log(expenseObj);
  return Promise.all([aggregators.monthAggregator(expenseObj), aggregators.yearAggregator(expenseObj),  aggregators.categoryAggregator(expenseObj)]);
}).then((result) => {
  console.log(result);
}).catch((err) => {
  console.log(err);
});
