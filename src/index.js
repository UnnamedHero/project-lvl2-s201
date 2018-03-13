import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import getParser from './configParser';

const computeObjDifference = (before, after) => {
  const keysUnion = _.union(Object.keys(before), Object.keys(after));
  const result = keysUnion.map((key) => {
    const isBothObjectsHaveKey = () => _.has(before, key) && _.has(after, key);
    const isObjectsValuesEqual = () => before[key] === after[key];
    const isRemovedValue = () => !_.has(after, key);
    const beforeString = `${key}: ${before[key]}`;
    const afterString = `${key}: ${after[key]}`;
    if (isBothObjectsHaveKey()) {
      return isObjectsValuesEqual() ? `    ${beforeString}`
        : `  - ${beforeString}\n  + ${afterString}`;
    }
    return isRemovedValue() ? `  - ${beforeString}` : `  + ${afterString}`;
  });
  return result;
};

const getConfigObject = (pathToFile) => {
  const data = fs.readFileSync(pathToFile, 'utf8');
  const ext = path.extname(pathToFile);
  const parse = getParser(ext);
  return parse(data);
};

export default (pathToFile1, pathToFile2) => {
  const beforeConfigObj = getConfigObject(pathToFile1);
  const afterConfigObj = getConfigObject(pathToFile2);
  const difference = computeObjDifference(beforeConfigObj, afterConfigObj);
  return ['{', ...difference, '}'].join('\n');
};
