const fs = require('fs'),
  constants = require('./constants'),
  debug = require('debug')('expense:helpers');

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

exports.sortObjectKeys = (obj) => {
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

exports.isNumber =  (n) => {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

exports.formatWord =  (word) => {
  if(!word) throw new TypeError('no word provided for format');
  return word.trim().toLowerCase();
}


exports.readFile = (path) => {
  const file = fs.createReadStream(path, {encoding: 'utf8'});
  return file;
}

exports.streamToPromise = (stream) => {
    return new Promise((resolve, reject) => {
        // resolve with location of saved file
        stream.on("finish", () => resolve());
        stream.on("error", reject);
    });
};

exports.readLineToPromise = (rd, data) => {
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
exports.createMonthsObject = () => {
  const obj = {};
  constants.MONTHS.forEach((month) => {
    obj[month] = {};
  });
  return obj;
};
