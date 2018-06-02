const fs = require('fs'),
  path = require('path'),
  debug = require('debug')('expense'),
  readline = require('readline');

//utilities
/**
*
* Capitalizes give string
* jan = > Jan
*/
String.prototype.capitalize = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

String.prototype.replaceAll = function (toReplace, replaceWith)
{
    return this.split(toReplace).join(replaceWith);
}

/**
* Sort object keys alphabetically
* https://stackoverflow.com/questions/5467129/sort-javascript-object-by-key#5467142
*/

function sortObjectKeys (obj) {
  const ordered = {};
  Object.keys(obj).sort().forEach((key) => {
    ordered[key] = obj[key];
  });
  return ordered;

  //
  // let array = Object.keys(obj);
  // array.sort((a, b) => a.localeCompare(b))
  // const newObj = {};
  // array.forEach((key) => {
  //   newObj[key] = key;
  // });
  // return newObj;
}

function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function formatWord (word) {
  if(!word) throw new TypeError('no word provided for format');
  return word.trim().toLowerCase();
}


const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
//ignore these words from categoryAggregator
const IGNORE_WORDS = ['a' ,'and', 'the', 'stuffs', 'others', 'or','day', 'days', 'month', 'months', 'week', 'weeks', 'year'];
//3 letters short name for month
const MONTHS_SHORT = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
const FILE_PATH = process.env.FILE_PATH || './data/sample-data.txt';

const readFile = (path) => {
  const file = fs.createReadStream(path, {encoding: 'utf8'});
  return file;
}

const streamToPromise = (stream) => {
    return new Promise((resolve, reject) => {
        // resolve with location of saved file
        stream.on("finish", () => resolve());
        stream.on("error", reject);
    });
};

const readLineToPromise = (rd, data) => {
    return new Promise((resolve, reject) => {
        // resolve with location of saved file
        rd.on("close", () => resolve(data));
        rd.on("error", reject);
    });
};


/**
* Creates an object with month as key
*
*/
const createMonthsObject = () => {
  const obj = {};
  MONTHS.forEach((month) => {
    obj[month] = {};
  });
  return obj;
};


/*
* Data Formatter
* Format data into json from file
*Data Format
*{
*    January: {
*      {'1': }
*    },
*    February: {
*    {'1': {'lunch': 20}},
*    {'2': {'fruits': 500}}
*  }
*}
*/
exports.fileParser = function fileParser() {

  //line reader object
  const rd = readline.createInterface({
      input: readFile(FILE_PATH)
  });

  const expenseObj = createMonthsObject();
  //start with January
  let currentMonth = MONTHS[0];
  //let currentMonthShort = MONTHS_SHORT[0];
  let currentDay = 1;

  rd.on('line', (line) => {
    debug('line', line);
    //first split the text by "-"
    const splitText = line.split('-');
    debug('splitText -', splitText);
    //check if it is a month name

    if (splitText[0]
      && splitText.length === 1
      && MONTHS.indexOf(formatWord(splitText[0]).capitalize()) !== -1) {
      currentMonth = formatWord(splitText[0]).capitalize();
    }
    //check for day and add it in the obj
    //day is separated by space and second character is the day in Number

    const daySplit = line.split(' ');
    debug('daySplit date (space)', daySplit);
    /*if (daySplit && daySplit.length === 2
      && MONTHS_SHORT.indexOf(daySplit[0].toLowerCase()) !== -1
      && isNumber(daySplit[1])
      && !expenseObj[currentMonth][daySplit[0]]) {
      // {apr: {}}
      currentMonthShort = daySplit[0].toLowerCase().trim();
      expenseObj[currentMonth][currentMonthShort] = {};

    }*/

    //add days to month
    if (daySplit[0] && daySplit.length === 2
      && MONTHS_SHORT.indexOf(formatWord(daySplit[0])) !== -1
      && isNumber(daySplit[1])) {
      // {apr: {1: {}}}
      let day = currentDay = daySplit[1].trim();
      debug('current month', expenseObj);
      expenseObj[currentMonth][currentDay] = {};
    }
    //check if is an expense record, should be lenth of 2
    //{'apple', '200'}
    if(!currentMonth) {
      throw new Error('FORMAT_ERROR:No current month for the line');
    }
    // if(!currentMonthShort) {
    //   throw new Error('FORMAT_ERROR:No current month short name for the line');
    // }
    if(!currentDay) {
      throw new Error('FORMAT_ERROR:No day for the line');
    }

    if (splitText && splitText.length === 2) {

      expenseObj[currentMonth][currentDay][formatWord(splitText[0])] = splitText[1].trim();
      //expenseObj[currentMonth][splitText[0]] = ;
    }
  });

  return readLineToPromise(rd, expenseObj);
}


/**
* Total Monthly Expenses
*/
exports.monthAggregator = function monthAggregator(expenseObj) {
  const aggregates = createMonthsObject();
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

/**
* Total annual expense
*/
exports.yearAggregator = function yearAggregator(expenseObj) {
  const aggregates = monthAggregator(expenseObj);
  let yearTotal = 0;
  for (let month in aggregates) {
    yearTotal += aggregates[month].total;
  }
  return { yearTotal };
}

/**
* Categorizes expenses
* categorize into every word in the expense sheet
*/
exports.categoryAggregator = function categoryAggregator(expenseObj) {
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
          let lowerCaseWord = formatWord(word);
          //add each word in the categories list
          //filter with IGNORE_WORDS.
          //filter numbers
          if(IGNORE_WORDS.indexOf(lowerCaseWord) === -1
            && !isNumber(Number(word))
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
          let lowerCaseWord = formatWord(word);
          if(wordsTillNow.indexOf(lowerCaseWord) !== -1) {
              categories[lowerCaseWord] += Number(expense)
          }
        });
      }
    }
  }
  return categories;
}


exports.fileParser().then((expenseObj) => {
  debug('expense Obj', expenseObj);
  return Promise.all([exports.categoryAggregator(expenseObj)]);
}).then((result) => {
  //console.log(sortObjectKeys(result[0]));
}).catch((err) => {
  console.log(err);
});
