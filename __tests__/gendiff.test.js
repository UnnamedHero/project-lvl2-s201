import fs from 'fs';
import gendiff from '../src';

const fixturePath = '__tests__/__fixtures__';

describe('gendiff', () => {
  const expected = fs.readFileSync(`${fixturePath}/plain-json-expected.txt`, 'utf8');
  test('with plain json', () => {
    const beforeFile = `${fixturePath}/before.json`;
    const afterFile = `${fixturePath}/after.json`;
    expect(gendiff(beforeFile, afterFile)).toBe(expected);
  });
  test('with plain yaml', () => {
    const beforeFile = `${fixturePath}/before.yaml`;
    const afterFile = `${fixturePath}/after.yaml`;
    expect(gendiff(beforeFile, afterFile)).toBe(expected);
  });
  test('with plain json amd yaml', () => {
    const beforeFile = `${fixturePath}/before.json`;
    const afterFile = `${fixturePath}/after.yaml`;
    expect(gendiff(beforeFile, afterFile)).toBe(expected);
  });
});
