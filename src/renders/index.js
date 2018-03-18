import jsonlike from './json-like';
import plain from './plain';
import jsonRender from './json';

const renders = {
  jsonlike,
  plain,
  jsonRender,
};

export default (type) => {
  const render = renders[type];
  if (!render) {
    throw new Error(`unknown render type: ${type}`);
  }
  return render;
};
