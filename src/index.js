import _ from 'lodash';
import configParser from './configParser';
import fileLoader from './fileLoader';

const computeObjDifference = (before, after) => {
  const keysUnion = _.union(Object.keys(before), Object.keys(after));
  const result = keysUnion.reduce((acc, key) => {
    const beforeValue = before[key];
    const afterValue = after[key];
    const beforeString = `${key}: ${beforeValue}`;
    const afterString = `${key}: ${afterValue}`;
    if (beforeValue && afterValue) {
      return beforeValue === afterValue ? [...acc, `    ${beforeString}`]
        : [...acc, `  - ${beforeString}`, `  + ${afterString}`];
    }
    return beforeValue ? [...acc, `  - ${beforeString}`] : [...acc, `  + ${afterString}`];
  }, []);
  return result;
};

export default (pathToFile1, pathToFile2) => {
  const beforeConfigObj = configParser(fileLoader(pathToFile1));
  const afterConfigObj = configParser(fileLoader(pathToFile2));
  const difference = computeObjDifference(beforeConfigObj, afterConfigObj);
  return ['{', ...difference, '}'].join('\n');
};
