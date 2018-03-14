import yaml from 'js-yaml';
import ini from 'ini';

const parsers = {
  '.json': JSON.parse,
  '.yaml': yaml.safeLoad,
  '.yml': yaml.safeLoad,
  '.ini': ini.parse,
};

export default ext => (data) => {
  const parser = parsers[ext];
  if (!parser) {
    throw new Error(`Unsupported format: "${ext}"`);
  }
  return parser(data);
};
