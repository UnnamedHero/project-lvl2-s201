import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

const jsonParser = data => JSON.parse(data);

const yamlParser = data => yaml.safeLoad(data);

export default (filePath) => {
  const configData = fs.readFileSync(filePath, 'utf8');
  switch (path.extname(filePath)) {
    case '.json':
      return jsonParser(configData);
    case '.yaml':
      return yamlParser(configData);
    default:
      throw new Error('unsupported file type');
  }
};

