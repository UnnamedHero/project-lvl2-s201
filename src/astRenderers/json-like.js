// import _ from 'lodash';
const renderResult = parsedAst => ['{', ...parsedAst, '}'].join('\n');


const renderStrings = (stringItem) => {
  const { key, beforeValue, afterValue, state } = stringItem;
  const makeConfigString = value => ` ${key}: ${value}`;
  switch (state) {
    case 'unchanged':
      return `   ${makeConfigString(beforeValue)}`;
    case 'changed':
      return `  -${makeConfigString(beforeValue)}\n  +${makeConfigString(afterValue)}`;
    case 'removed':
      return `  -${makeConfigString(beforeValue)}`;
    case 'added':
      return `  +${makeConfigString(afterValue)}`;
    default:
      return '';
  }
};

export default () => ({
  renderStrings,
  renderResult,
});
