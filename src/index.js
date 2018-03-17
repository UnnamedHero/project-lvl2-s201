import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import getParser from './configParser';
import renderAst from './astRender';

const getDifferenceAst = (before, after) => {
  const keysUnion = _.union(_.keys(before), _.keys(after));
  const ast = keysUnion.map((key) => {
    const beforeValue = before[key];
    const afterValue = after[key];
    const isBothObjectsHaveKey = () => _.has(before, key) && _.has(after, key);
    const isBothValuesAreObjects = () =>
      _.isPlainObject(beforeValue) && _.isPlainObject(afterValue);
    const isObjectsValuesEqual = () => _.isEqual(beforeValue, afterValue);
    const isRemovedValue = () => !_.has(after, key);
    const buildAstNode = {
      nested: () => (
        {
          key,
          type: 'nested',
          children: getDifferenceAst(beforeValue, afterValue),
        }),
      unchanged: () => (
        {
          key,
          type: 'unchanged',
          value: beforeValue,
        }),
      changed: () => (
        {
          key,
          type: 'changed',
          value: afterValue,
          oldValue: beforeValue,
        }),
      added: () => (
        {
          key,
          type: 'added',
          value: afterValue,
        }),
      removed: () => (
        {
          key,
          type: 'removed',
          value: beforeValue,
        }),
    };
    if (isBothObjectsHaveKey()) {
      if (isBothValuesAreObjects()) {
        return buildAstNode.nested();
      }
      return isObjectsValuesEqual() ? buildAstNode.unchanged() : buildAstNode.changed();
    }
    return isRemovedValue() ? buildAstNode.removed() : buildAstNode.added();
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
  return renderAst(differenceAst);
};
