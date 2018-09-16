
# Daily Expense Visualization 
[![Build Status](https://travis-ci.org/bring2dip/daily-expense-visualization.svg?branch=master)](https://travis-ci.org/bring2dip/daily-expense-visualization)

Welcome to Daily Expense Visualization. This is a Work in Progress.

It reads your expense file and performs calculations like total monthly expenses, annual expenses, categorize expenses by name.
This module will eventually include visualizations, hence the name daily expense visualization. And I am also planning to apply some deep learning principles into this.


## Installation

`npm i daily-expense-visualization`


## Usage

```
 const dailyExpVis = require('daily-expense-visualization');

 const filePath = '/path/to/file';

 dailyExpVis.fileParser(filePath).then((expenseObj) => {
    return dailyExpVis.aggregators.monthAggregator(expenseObj);
 }).then((result) => {
    console.log(result);
 });

```


## API


`fileParser(filePath: string)`

 **aggregators**

`monthAggregator(expenseObj: Object)`  

`yearAggregator(expenseObj: Object)`  

`categoryAggregator(expenseObj: Object)`

`categoryMonthAggregator(expenseObj: Object, month : String)`


# Contributing Guide

  See [contributing guide](./CONTRIBUTING.md)
