import * as path from 'path';
import * as fs from 'fs';
import { DotenvParseOutput, parse } from 'dotenv';

let env: DotenvParseOutput | undefined;

export function parseDotEnv (dir: string) {
  return ['.env.local', `.env.${process.env.NODE_ENV}`, '.env']
    .map(fn => path.join(dir, fn))
    .filter(fs.existsSync)
    .map(fn => parse(fs.readFileSync(fn, { encoding: 'utf-8' })))
    .reduce((curr, obj) => {
      return Object.assign(curr, obj);
    }, {});
}
