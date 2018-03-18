#!/usr/bin/env node
import program from 'commander';
import { version as gendiffVersion } from '../../package.json';
import gendiff from '../';

program
  .description('Compares two configuration files and shows a difference.')
  .version(gendiffVersion)
  .option('-f, --format [type]', 'Output format: plain, jsonlike(deflt)', 'jsonlike')
  .arguments('<firstConfig> <secondConfig>')
  .action((firstConfig, secondConfig) => {
    console.log(gendiff(firstConfig, secondConfig, program.format));
  })
  .parse(process.argv);
