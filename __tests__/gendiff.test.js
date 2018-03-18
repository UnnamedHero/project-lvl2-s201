import fs from 'fs';
import path from 'path';
import gendiff from '../src';

const fixturesPath = path.join(__dirname, '__fixtures__');

describe('gendiff#1', () => {
  const plainFixturesPath = path.join(fixturesPath, 'plain');
  const pathTo = file => path.join(plainFixturesPath, file);
  const expected = fs.readFileSync(pathTo('expected-jsonlike.txt'), 'utf8');
  const expetedPlain = fs.readFileSync(pathTo('expected-plain.txt'), 'utf-8');
  test('with plain json', () => {
    expect(gendiff(pathTo('before.json'), pathTo('after.json'), 'jsonlike')).toBe(expected);
  });
  test('with plain yaml', () => {
    expect(gendiff(pathTo('before.yaml'), pathTo('after.yaml'), 'jsonlike')).toBe(expected);
  });
  test('with plain json amd yaml', () => {
    expect(gendiff(pathTo('before.json'), pathTo('after.yaml'), 'jsonlike')).toBe(expected);
  });
  test('with plain ini', () => {
    expect(gendiff(pathTo('before.ini'), pathTo('after.ini'), 'jsonlike')).toBe(expected);
  });
  test('with json and plain output', () => {
    expect(gendiff(pathTo('before.json'), pathTo('after.json'), 'plain')).toBe(expetedPlain);
  });
});

describe('gendiff#2', () => {
  const nestedFixturesPath = path.join(fixturesPath, 'nested');
  const pathTo = file => path.join(nestedFixturesPath, file);
  const expected = fs.readFileSync(pathTo('expected-json-like.txt'), 'utf8');
  const expectedPlain = fs.readFileSync(pathTo('expected-plain.txt'), 'utf8');
  test('with nested json', () => {
    expect(gendiff(pathTo('before.json'), pathTo('after.json'), 'jsonlike')).toBe(expected);
  });
  test('with nested yml', () => {
    expect(gendiff(pathTo('before.yml'), pathTo('after.yml'), 'jsonlike')).toBe(expected);
  });
  test('with nested ini', () => {
    expect(gendiff(pathTo('before.ini'), pathTo('after.ini'), 'jsonlike')).toBe(expected);
  });
  test('with json and plain output', () => {
    expect(gendiff(pathTo('before.json'), pathTo('after.json'), 'plain')).toBe(expectedPlain);
  });
});
