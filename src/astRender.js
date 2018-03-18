import { jsonlike, plain, jsonRender } from './renders';

const renders = {
  jsonlike,
  plain,
  json: jsonRender,
};

export default (renderType) => {
  const render = renders[renderType];
  if (!render) {
    throw new Error(`unknown render type: ${renderType}`);
  }
  return render;
};
