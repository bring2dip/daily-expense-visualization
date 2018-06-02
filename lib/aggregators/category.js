const path = require('path'),
  constants = require(path.resolve('./lib/constants')),
  debug = require('debug')('expense:aggregators:category');
  helpers = require(path.resolve('./lib/helpers')),
/**
* Categorizes expenses
* categorize into every word in the expense sheet
*/
exports.categoryAggregator =  (expenseObj) => {
  const categories = {};
  //iterating through the month
  for (let month in expenseObj) {
    const monthExpenses = expenseObj[month];
    //iterating through each day in month
    for (let day in monthExpenses) {

      let dayExpenses = monthExpenses[day];
      //itierating through each expense in a day
      for(let category in dayExpenses) {
        //words in an expense name
        const words = category.split(' ');

        words.forEach((word) => {
          let lowerCaseWord = helpers.formatWord(word);
          //add each word in the categories list
          //filter with IGNORE_WORDS.
          //filter numbers
          if(constants.IGNORE_WORDS.indexOf(lowerCaseWord) === -1
            && !helpers.isNumber(Number(word))
            && !categories[lowerCaseWord]) {
            categories[lowerCaseWord] = 0;
          }
        });

        // if(!categories[category]) {
        //   categories[category] = 0;
        // }

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

        const wordsTillNow = Object.keys(categories);

        //check if each of the word in the expense name is in the wordsTillNow list,
        //if yes add an expense in that category
        words.forEach((word) => {
          let lowerCaseWord = helpers.formatWord(word);
          if(wordsTillNow.indexOf(lowerCaseWord) !== -1) {
              categories[lowerCaseWord] += Number(expense)
          }
        });
      }
    }
  }
  return categories;
}
