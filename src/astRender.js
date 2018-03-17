import { jsonlike } from './renders';

const renders = {
  jsonlike,
};

export default (renderType) => {
  const render = renders[renderType];
  if (!render) {
    throw new Error(`unknown render type: ${renderType}`);
  }
  return render;
};
