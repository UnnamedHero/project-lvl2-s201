import fs from 'fs';
import gendiff from '../src';

const fixturePath = '__tests__/__fixtures__';

describe('gendiff', () => {
  test('with plain json', () => {
    const expected = fs.readFileSync(`${fixturePath}/plain-json-expected.txt`, 'utf8');
    const beforeFile = `${fixturePath}/before.json`;
    const afterFile = `${fixturePath}/after.json`;
    //console.log(expected);
    expect(gendiff(beforeFile, afterFile)).toBe(expected);
  });
});
