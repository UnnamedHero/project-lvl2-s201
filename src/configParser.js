import yaml from 'js-yaml';
import ini from 'ini';

const jsonParser = data => JSON.parse(data);

const yamlParser = data => yaml.safeLoad(data);

const iniParser = data => ini.parse(data);

export default ({ type, data }) => {
  switch (type) {
    case '.json':
      return jsonParser(data);
    case '.yaml':
      return yamlParser(data);
    case '.ini':
      return iniParser(data);
    default:
      throw new Error('unsupported file type');
  }
};

