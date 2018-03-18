import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import getParser from './configParser';
import getRender from './astRender';

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
    const astNodes = [
      {
        type: 'nested',
        check: () => isBothObjectsHaveKey() && isBothValuesAreObjects(),
        getParts: () => ({ children: getDifferenceAst(beforeValue, afterValue) }),
      },
      {
        type: 'unchanged',
        check: () => isBothObjectsHaveKey() && isObjectsValuesEqual(),
        getParts: () => ({ value: beforeValue }),
      },
      {
        type: 'changed',
        check: () => isBothObjectsHaveKey() && !isObjectsValuesEqual(),
        getParts: () => ({
          value: afterValue,
          oldValue: beforeValue,
        }),
      },
      {
        type: 'removed',
        check: () => isRemovedValue(),
        getParts: () => ({ value: beforeValue }),
      },
      {
        type: 'added',
        check: () => !isRemovedValue(),
        getParts: () => ({ value: afterValue }),
      },
    ];
    const { type, getParts } = _.find(astNodes, ({ check }) => check());
    return { key, type, ...getParts() };
  });
  return ast;
};

const getConfigObject = (pathToFile) => {
  const data = fs.readFileSync(pathToFile, 'utf8');
  const ext = path.extname(pathToFile);
  const parse = getParser(ext);
  return parse(data);
};

export default (pathToFile1, pathToFile2, format) => {
  const beforeConfigObj = getConfigObject(pathToFile1);
  const afterConfigObj = getConfigObject(pathToFile2);
  const differenceAst = getDifferenceAst(beforeConfigObj, afterConfigObj);
  // const renderType = 'jsonlike';
  const render = getRender(format);
  return render(differenceAst);
};
