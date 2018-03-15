import _ from 'lodash';

const spaces = num => ' '.repeat(num);
const makeString = (key, value) => {
  return `${spaces(2)}${key}: ${value}`;
};

const parseMeta = (keyMeta) => {
  if (!_.isPlainObject(keyMeta)) {
    return keyMeta;
  }
  return 'fucking obj!';
};

const prepareAst = (ast) => {
  const parsedValues = _.keys(ast).reduce((acc, key) => {
    const keyMeta = ast[key];
    const { state } = keyMeta;
    return [...acc, `${spaces(2)}${key}: ${parseMeta(keyMeta)}`];
  }, []);
  return ['{', ...parsedValues, '}'];
};

export default ast => prepareAst(ast).join('\n');
