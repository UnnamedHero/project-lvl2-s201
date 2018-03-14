import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import getParser from './configParser';
import getRender from './astRenders';

// TODO if both values are objects they must not be marked as "changed"
const getDifferenceAst = (before, after) => {
  const keysUnion = _.union(Object.keys(before), Object.keys(after));
  const ast = keysUnion.map((key) => {
    const beforeValue = before[key];
    const afterValue = after[key];
    const isBothObjectsHaveKey = () => _.has(before, key) && _.has(after, key);
    const isObjectsValuesEqual = () => {
      if (!_.isEqual(beforeValue, afterValue)) {
        return false;
      }
      return true;
    };
    const isRemovedValue = () => !_.has(after, key);
    const makeAstNode = (state) => {
      const astNode = {
        key,
        state,
      };
      if (_.isObject(beforeValue) && _.isObject(afterValue)) {
        const children = getDifferenceAst(beforeValue, afterValue);
        return { ...astNode, children };
      }
      return { ...astNode, beforeValue, afterValue };
    };
    // const beforeString = `${key}: ${before[key]}`;
    // const afterString = `${key}: ${after[key]}`;
    if (isBothObjectsHaveKey()) {
      return isObjectsValuesEqual() ? makeAstNode('unchanged') : makeAstNode('changed');
    }
    return isRemovedValue() ? makeAstNode('removed') : makeAstNode('added');
  });
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
  return render(differenceAst);
};
