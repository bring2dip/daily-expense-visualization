const path = require('path'),
  parser = require(path.resolve('lib/parser')),
  aggregators = require(path.resolve('lib/aggregators')),
  helpers = require(path.resolve('lib/helpers'));


const file = process.env.FILE_PATH || path.resolve('data/sample-data.txt');
const month = process.env.MONTH || 'january';
parser.fileParser(file).then((expenseObj) => {
  //console.log(expenseObj);
  return Promise.all([aggregators.monthAggregator(expenseObj), aggregators.yearAggregator(expenseObj),  aggregators.categoryAggregator(expenseObj)]);
}).then((result) => {
  console.log(result);
}).catch((err) => {
  console.log(err);
});
