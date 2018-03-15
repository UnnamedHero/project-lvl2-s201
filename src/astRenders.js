import renderJsonLike from './astRenderers/json-like';

// const launchRender = (render, ast) => {
//   const { renderStrings, renderResult } = render();
//   const renderedAst = ast.reduce(renderStrings, []);
//   //console.log(renderResult(renderedAst));
//   return renderResult(renderedAst);
// };

const renders = {
  'json-like': renderJsonLike,
};

export default renderType => (ast) => {
  const render = renders[renderType];
  if (!render) {
    throw new Error(`Unsupported output format '${renderType}'`);
  }
  // console.log(JSON.stringify(ast));
  const result = render(ast);
  console.log(result);
  return result;
};
