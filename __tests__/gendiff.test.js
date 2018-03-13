import fs from 'fs';
import gendiff from '../src';

const fixturePath = '__tests__/__fixtures__';

describe('gendiff', () => {
  const expected = fs.readFileSync(`${fixturePath}/plain/plain-expected.txt`, 'utf8');
  const beforeFilePath = `${fixturePath}/plain/before`;
  const afterFilePath = `${fixturePath}/plain/after`;
  test('with plain json', () => {
    expect(gendiff(`${beforeFilePath}.json`, `${afterFilePath}.json`)).toBe(expected);
  });
  test('with plain yaml', () => {
    expect(gendiff(`${beforeFilePath}.yaml`, `${afterFilePath}.yaml`)).toBe(expected);
  });
  test('with plain json amd yaml', () => {
    expect(gendiff(`${beforeFilePath}.json`, `${afterFilePath}.yaml`)).toBe(expected);
  });
  test('with plain ini', () => {
    expect(gendiff(`${beforeFilePath}.ini`, `${afterFilePath}.ini`)).toBe(expected);
  });
});
