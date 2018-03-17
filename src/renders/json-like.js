import _ from 'lodash';

const indent = depth => ' '.repeat(4).repeat(depth);

const renderValue = (value, depth) => {
  if (!_.isPlainObject(value)) {
    return value;
  }
  const stringifyObj = (objVal) => {
    const iter = (acc, obj, iDepth) => _.keys(obj)
      .reduce((iAcc, key) => {
        const val = obj[key];
        const keyStr = `${indent(iDepth)}${key}: `;
        if (!_.isPlainObject(val)) {
          return `${iAcc}${keyStr}${val}`;
        }
        const newAcc = `${iAcc}${keyStr}{\n`;
        return iter(newAcc, val, iDepth);
      }, acc);
    return iter('{\n', objVal, depth + 1);
  };
  const closeCurlyBrace = `\n${indent(depth)}}`;
  return `${stringifyObj(value)}${closeCurlyBrace}`;
};

const buildNodeString = (keyPrefix, key, value, depth) =>
  `${indent(depth)}${keyPrefix}${key}: ${renderValue(value, depth + 1)}`;

const astRender = (ast, depth = 0) => {
  const nodeParsers = {
    nested: (node, nodeDepth) =>
      buildNodeString(indent(nodeDepth + 1), node.key, astRender(node.children, nodeDepth + 1)),
    unchanged: (node, nodeDepth) => buildNodeString(indent(1), node.key, node.value, nodeDepth),
    added: (node, nodeDepth) => buildNodeString('  + ', node.key, node.value, nodeDepth),
    removed: (node, nodeDepth) => buildNodeString('  - ', node.key, node.value, nodeDepth),
    changed: (node, nodeDepth) => {
      const removedStr = buildNodeString('  - ', node.key, node.oldValue, nodeDepth);
      const addedStr = nodeParsers.added(node, nodeDepth);
      return [removedStr, addedStr];
    },
  };
  const diffStrings = ast.map((node) => {
    const parser = nodeParsers[node.type];
    return parser(node, depth);
  });
  const closeCurlyBrace = `${indent(depth)}}`;
  const flattenedChangedItems = _.flatten(diffStrings);
  return ['{', ...flattenedChangedItems, closeCurlyBrace].join('\n');
};

export default astRender;
