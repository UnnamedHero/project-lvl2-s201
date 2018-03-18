import _ from 'lodash';

const renderValue = (value) => {
  if (!value) {
    return '';
  }
  if (_.isPlainObject(value)) {
    return ' complex value';
  }
  if (_.isArray(value)) {
    const [added, removed] = value;
    const simpleParse = v => (_.isPlainObject(v) ? 'complex value' : `'${v}'`);
    return ` From ${simpleParse(removed)} to ${simpleParse(added)}`;
  }
  return ` value: '${value}'`;
};

const buildString = (parents, actionString, value) =>
  `Property '${parents.join('.')}' ${actionString}${renderValue(value)}`;

const renderPlain = (ast, parents = []) => {
  const nodeParsers = {
    nested: (node, propParents) => renderPlain(node.children, propParents),
    unchanged: () => null,
    added: (node, propParents) => buildString(propParents, 'was added with', node.value),
    removed: (node, propParents) => buildString(propParents, 'was removed'),
    changed: (node, propParents) => buildString(propParents, 'was changed.', [node.value, node.oldValue]),

  };
  const diffStrings = ast.map((node) => {
    const parser = nodeParsers[node.type];
    return parser(node, [...parents, node.key]);
  });
  const filteredItems = diffStrings.filter(v => v);
  return filteredItems.join('\n');
};

export default renderPlain;
