import configParser from './configParser';
import fileLoader from './fileLoader';

export default (pathToFile1, pathToFile2) => {
  const beforeConfig = configParser(fileLoader(pathToFile1));
  const afterConfig = configParser(fileLoader(pathToFile2));
  const removedOrChangedEntries = Object.keys(beforeConfig).reduce((acc, key) => {
    const beforeValue = beforeConfig[key];
    const afterValue = afterConfig[key];
    const beforeString = `${key}: ${beforeValue}`;
    const afterString = `${key}: ${afterValue}`;
    if (afterConfig[key]) {
      return beforeValue === afterValue ? [...acc, `    ${beforeString}`]
        : [...acc, `  - ${beforeString}`, `  + ${afterString}`];
    }
    return [...acc, `  - ${beforeString}`];
  }, []);
  const newEntries = Object.keys(afterConfig)
    .filter(key => !beforeConfig[key])
    .map(key => `  + ${key}: ${afterConfig[key]}`);
  return ['{', ...removedOrChangedEntries, ...newEntries, '}'].join('\n');
};
