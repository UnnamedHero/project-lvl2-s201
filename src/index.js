import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import getParser from './configParser';

const isBothObjectsHaveKey = (key, obj1, obj2) => _.has(obj1, key) && _.has(obj2, key);

const isObjectsValuesEqual = (key, obj1, obj2) => obj1[key] === obj2[key];

const isRemovedValue = (key, obj) => !_.has(obj, key);

const computeObjDifference = (before, after) => {
  const keysUnion = _.union(Object.keys(before), Object.keys(after));
  const result = keysUnion.reduce((acc, key) => {
    const beforeString = `${key}: ${before[key]}`;
    const afterString = `${key}: ${after[key]}`;
    if (isBothObjectsHaveKey(key, before, after)) {
      return isObjectsValuesEqual(key, before, after) ? [...acc, `    ${beforeString}`]
        : [...acc, `  - ${beforeString}`, `  + ${afterString}`];
    }
    if (isRemovedValue(key, after)) {
      return [...acc, `  - ${beforeString}`];
    }
    return [...acc, `  + ${afterString}`];
  }, []);
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
