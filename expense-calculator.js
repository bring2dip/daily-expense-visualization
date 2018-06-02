const fs = require('fs'),
  path = require('path'),
  debug = require('debug')('expense'),
  readline = require('readline');

/**
*
* Capitalizes give string
* jan = > Jan
*/
String.prototype.capitalize = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}


const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
//3 letters short name for month
const MONTHS_SHORT = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
const FILE_PATH = './data/expense-2017.txt';

const readFile = (path) => {
  const file = fs.createReadStream(path, {encoding: 'utf8'});
  return file;
}

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

const rd = readline.createInterface({
    input: readFile(FILE_PATH)
});

const monthly_expenses = [];
const monthsObj = createMonthsObject();

//start with January
let currentMonth = MONTHS[0];
let currentMonthShort = MONTHS_SHORT[0];
let currentDay = 1;

rd.on('line', (line) => {

  //first split the text by "-"
  const splitText = line.split('-');
  //debug('line', line);
  //check if it is a month name
  if (splitText && splitText.length === 1 &&
    splitText[0] && MONTHS.indexOf(splitText[0].toLowerCase().capitalize()) !== -1) {
    currentMonth = splitText[0];
    //monthIndex ++;
  }
  //check for day and add it in the obj
  //day is separated by space and second character is the day in Number

  const daySplit = line.split(' ');
  //debug('daySplit date', MONTHS_SHORT.indexOf(daySplit[0].toLowerCase()), daySplit[0]);
  if (daySplit && daySplit.length === 2
    && MONTHS_SHORT.indexOf(daySplit[0].toLowerCase()) !== -1
    && isNumber(daySplit[1])
    && !monthsObj[currentMonth][daySplit[0]]) {
    // {apr: {}}
    currentMonthShort = daySplit[0].toLowerCase().trim();
    monthsObj[currentMonth][currentMonthShort] = {};

  }

  //add days to month
  if (daySplit && daySplit.length === 2
    && MONTHS_SHORT.indexOf(daySplit[0].toLowerCase()) !== -1
    && isNumber(daySplit[1])) {
    // {apr: {1: {}}}
    let day = currentDay = daySplit[1].trim();
    monthsObj[currentMonth][currentMonthShort][currentDay] = {};
  }
  //check if is an expense record, should be lenth of 2
  //{'apple', '200'}
  if(!currentMonth) {
    throw new Error('FORMAT_ERROR:No current month for the line');
  }
  if(!currentMonthShort) {
    throw new Error('FORMAT_ERROR:No current month short name for the line');
  }
  if(!currentDay) {
    throw new Error('FORMAT_ERROR:No day for the line');
  }

  if (splitText && splitText.length === 2) {

    monthsObj[currentMonth][currentMonthShort][currentDay][splitText[0].trim()] = splitText[1].trim();
    //monthsObj[currentMonth][splitText[0]] = ;
  }
});

/*
{
    January: {
      {'1': }
    }
}
*/
rd.on('close', () => {
  console.log(monthsObj.December);
});
