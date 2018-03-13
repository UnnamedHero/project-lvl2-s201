import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import ini from 'ini';

const SUPPORTED_FORMATS = new Set(['.json', '.yaml', '.ini']);

const loadFile = filePath => ({
  type: path.extname(filePath),
  data: fs.readFileSync(filePath, 'utf8'),
});

const makeObject = {
  '.json': data => JSON.parse(data),
  '.yaml': data => yaml.safeLoad(data),
  '.ini': data => ini.parse(data),
};

const isSupportedFormat = type => SUPPORTED_FORMATS.has(type);

export default (filePath) => {
  const { type, data } = loadFile(filePath);
  if (!isSupportedFormat(type)) {
    throw new Error('unsupported file type');
  }
  return makeObject[type](data);
};

