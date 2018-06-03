const fs = require('fs'),
  path = require('path'),
  debug = require('debug')('expense:parser'),
  helpers = require('./helpers'),
  constants = require('./constants'),
  readline = require('readline');
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

exports.fileParser = (filePath) => {

  if(!filePath) {
    throw new Error('filePath missing');
  }

  //line reader object
  const rd = readline.createInterface({
      input: helpers.readFile(filePath)
  });

  const expenseObj = helpers.createMonthsObject();
  //start with January
  let currentMonth = constants.MONTHS[0];
  //let currentMonthShort = MONTHS_SHORT[0];
  let currentDay = 1;

  rd.on('line', (line) => {
    debug('line', line);
    //first split the text by "-"
    const splitText = line.split('-');
    debug('splitText -', splitText);
    //check if it is a month name

    if (splitText.length === 1
      && splitText[0]
      && constants.MONTHS.indexOf(helpers.formatWord(splitText[0]).capitalize()) !== -1) {
      currentMonth = helpers.formatWord(splitText[0]).capitalize();
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
      && constants.MONTHS_SHORT.indexOf(helpers.formatWord(daySplit[0])) !== -1
      && helpers.isNumber(daySplit[1])) {
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

      expenseObj[currentMonth][currentDay][helpers.formatWord(splitText[0])] = splitText[1].trim();
      //expenseObj[currentMonth][splitText[0]] = ;
    }
  });

  return helpers.readLineToPromise(rd, expenseObj);
}
