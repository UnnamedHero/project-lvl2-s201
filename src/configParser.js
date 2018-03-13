import yaml from 'js-yaml';

const jsonParser = data => JSON.parse(data);

const yamlParser = data => yaml.safeLoad(data);

export default ({ type, data }) => {
  switch (type) {
    case '.json':
      return jsonParser(data);
    case '.yaml':
      return yamlParser(data);
    default:
      throw new Error('unsupported file type');
  }
};

