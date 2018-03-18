import _ from 'lodash';

const renderValue = (value) => {
  if (_.isPlainObject(value)) {
    return ' complex value';
  }
  if (_.isArray(value)) {
    const [added, removed] = value;
    const parseChangedVal = v => (_.isPlainObject(v) ? 'complex value' : `'${v}'`);
    return ` From ${parseChangedVal(removed)} to ${parseChangedVal(added)}`;
  }
  return ` value: '${value}'`;
};

const buildString = (parents, actionString, value) =>
  `Property '${parents.join('.')}' ${actionString}${value ? renderValue(value) : ''}`;

const renderPlain = (ast, parents = []) => {
  const nodeParsers = {
    nested: (node, propParents) => renderPlain(node.children, [...propParents, node.key]),
    added: (node, propParents) => buildString([...propParents, node.key], 'was added with', node.value),
    removed: (node, propParents) => buildString([...propParents, node.key], 'was removed'),
    changed: (node, propParents) => buildString([...propParents, node.key], 'was changed.', [node.value, node.oldValue]),

  };
  const diffStrings = ast
    .filter(node => node.type !== 'unchanged')
    .map((node) => {
      const parser = nodeParsers[node.type];
      return parser(node, parents);
    });
  return diffStrings
    .filter(v => v)
    .join('\n');
};

export default renderPlain;
