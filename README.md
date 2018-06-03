
# Daily Expense Visualization  
Welcome to Daily Expense Visualization. This is a Work in Progress.

It reads your expense file and performs calculations like total monthly expenses, annual expenses, categorize expenses by name.
This module will eventually include visualizations, hence the name daily expense visualization. And I am also planning to apply some deep learning principles into this.


## Installation

`npm i`  
  

## Run Example:

  
`node examples/index.js`  
  **Or with custom file path**
  `FILE_PATH = '/path/to/file' node examples/index.js`  
  

## API

  
`fileParser(filePath: string)`  
  
`monthAggregator(expenseObj: Object)`  
  
`yearAggregator(expenseObj: Object)`  
  
`categoryAggregator(expenseObj: Object)`


# For Developers


## Run Tests

 
`npm run test`  