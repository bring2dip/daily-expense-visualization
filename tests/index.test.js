const path = require('path'),
  parser = require(path.resolve('./lib/parser')),
  aggregators = require(path.resolve('./lib/aggregators'));


describe('test functionality', () => {
const TEST_FILE_PATH = path.resolve('./data/test-data.txt');

  test('should show error when filePath is not set', () => {
    expect(() => {
        return parser.fileParser();
      }).toThrow();
  });

  test('parse file correctly', () => {
    return parser.fileParser(TEST_FILE_PATH).then((expenseObj) => {
      expect(expenseObj.April).toEqual({
        '1': {},
       '28': { groceries: '20,000', bike: '80', lunch: '140' },
       '30': { petrol: '(300)', lunch: '180' } });
    });
  });

  test('month aggregator', () => {
    return parser.fileParser(TEST_FILE_PATH).then((expenseObj) => {
      return aggregators.monthAggregator(expenseObj);
    }).then((result) => {
      expect(result.April).toEqual({ total: 20100, dailyAverage: 6700});
    });
  });

  test('year aggregator', () => {
    return parser.fileParser(TEST_FILE_PATH).then((expenseObj) => {
      return aggregators.yearAggregator(expenseObj);
    }).then((result) => {
      expect(result).toEqual({ yearTotal: 26070 });
    });
  });

  test('category aggregator', () => {
    return parser.fileParser(TEST_FILE_PATH).then((expenseObj) => {
      return aggregators.categoryAggregator(expenseObj);
    }).then((result) => {
      expect(result.groceries).toEqual(20000);
      expect(result.bike).toEqual(110);
    });
  });

  test('category month aggregator', () => {
    return parser.fileParser(TEST_FILE_PATH).then((expenseObj) => {
      return aggregators.categoryMonthAggregator(expenseObj, 'may');
    }).then((result) => {
      expect(result.May.breakfast).toEqual(590);
    });
  });


});
