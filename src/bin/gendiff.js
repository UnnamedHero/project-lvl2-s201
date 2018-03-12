#!/usr/bin/env node
import program from 'commander';
import { version as gendiffVersion } from '../../package.json';

program
  .description('Compares two configuration files and shows a difference.')
  .version(gendiffVersion)
  .option('-f, --format [type]', 'Output format')
  .arguments('<firstConfig> <secondConfig>')
  .parse(process.argv);