install:
	npm install

start:
	npm run babel-node -- src/bin/gendiff.js

publish:
	npm publish

lint:
	npm run eslint .

build:
	rm -rf dist
	npm run build

test:
	npm test

test-plain:
	npm run babel-node -- src/bin/gendiff.js --format=plain __tests__/__fixtures__/nested/before.json __tests__/__fixtures__/nested/after.json

test-json:
	npm run babel-node -- src/bin/gendiff.js --format=json __tests__/__fixtures__/nested/before.json __tests__/__fixtures__/nested/after.json