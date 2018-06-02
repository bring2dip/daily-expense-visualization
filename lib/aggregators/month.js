const path = require('path'),
  constants = require(path.resolve('./lib/constants')),
  debug = require('debug')('expense:aggregators:month');
  helpers = require(path.resolve('./lib/helpers')),
/**
* Total Monthly Expenses
*/
exports.monthAggregator = (expenseObj) => {
  const aggregates = helpers.createMonthsObject();
  //iterating through the month
  for (let month in expenseObj) {
    const monthExpenses = expenseObj[month];
    //setting months total to 0
    if(!aggregates[month].total) {
      aggregates[month].total = 0;
    }

    if(!aggregates[month].dailyAverage) {
      aggregates[month].dailyAverage = 0;
    }

    //iterating through each day in month
    for (let day in monthExpenses) {

      let dayExpenses = monthExpenses[day];

      //itierating through each expense in a day
      for(let category in dayExpenses) {

        let expense = dayExpenses[category];
        //check if negative number
        if(expense.indexOf('(') !== -1) {
          //replace left and right parenthesis
          expense = expense.replaceAll('(', '').replaceAll(')', '');
        }
        //check if number is formatted with ","
        if(expense.indexOf(',')) {
          expense = expense.replaceAll(',', '')
        }

        aggregates[month].total += Number(expense);
        //aggregates[month].dailyAverage = Number(expense);
      }
    }

    const numOfDays = Object.keys(monthExpenses).length;
    aggregates[month].dailyAverage = aggregates[month].total/numOfDays;
    //console.log(expenseObj[month]);
  }
  return aggregates;
}
