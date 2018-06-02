const path = require('path'),
  parser = require(path.resolve('./lib/parser')),
  aggregators = require(path.resolve('./lib/aggregators'));

test('parse file correctly', () => {
  const TEST_FILE_PATH = path.resolve('./data/test-data.txt');
  return parser.fileParser(TEST_FILE_PATH).then((expenseObj) => {
    console.log(expenseObj);

    expect(expenseObj.April).toBe({
      '1': {},
     '28': { groceries: '20,000', bike: '80', lunch: '140' },
     '30': { petrol: '(300)', lunch: '180' } });
  });
});
