import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import getParser from './configParser';
import getRender from './astRenders';

// TODO if both values are objects they must not be marked as "changed"
const getDifferenceAst = (before, after) => {
  const keysUnion = _.union(_.keys(before), _.keys(after));
  const ast = keysUnion.reduce((acc, key) => {
    const beforeValue = before[key];
    const afterValue = after[key];
    const isBothObjectsHaveKey = () => _.has(before, key) && _.has(after, key);
    const isBothValuesAreObjects = () =>
      _.isPlainObject(beforeValue) && _.isPlainObject(afterValue);
    const isObjectsValuesEqual = () => {
      if (isBothValuesAreObjects()) {
        return false;
      }
      if (!_.isEqual(beforeValue, afterValue)) {
        return false;
      }
      return true;
    };
    const isRemovedValue = () => !_.has(after, key);
    const makeNestedAstNode = () => ({
      ...acc,
      [key]: {
        state: 'nested',
        children: getDifferenceAst(beforeValue, afterValue),
      },
    });
    const makeAstNode = state => ({
      ...acc,
      [key]: {
        state, beforeValue, afterValue,
      },
    });
    if (isBothObjectsHaveKey()) {
      if (isBothValuesAreObjects()) {
        return makeNestedAstNode();
      }
      return isObjectsValuesEqual() ? makeAstNode('unchanged') : makeAstNode('changed');
    }
    return isRemovedValue() ? makeAstNode('removed') : makeAstNode('added');
  }, {});
  return ast;
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
  const differenceAst = getDifferenceAst(beforeConfigObj, afterConfigObj);
  const renderType = 'json-like';
  const render = getRender(renderType);
  // console.log(JSON.stringify(differenceAst));
  return render(differenceAst);
};
