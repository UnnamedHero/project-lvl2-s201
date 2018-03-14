import renderJsonLike from './astRenderers/json-like';

const launchRender = (render, ast) => {
  const { renderStrings, renderResult } = render();
  const parsedAst = ast.map(renderStrings);
  return renderResult(parsedAst);
};

const renders = {
  'json-like': renderJsonLike,
};

export default renderType => (ast) => {
  const render = renders[renderType];
  if (!render) {
    throw new Error(`Unsupported output format '${renderType}'`);
  }
  console.log(JSON.stringify(ast));
  return launchRender(render, ast);
};
