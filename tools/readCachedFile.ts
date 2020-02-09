import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import request from 'request-promise-native';
import cheerio from 'cheerio';

const writeAsync = promisify(fs.writeFile);

const ONE_HOUR = 1000 * 60 * 60;
const CACHE_STALE_TIME = ONE_HOUR;

export default async function fetchPage(key: string, url: string) {
  const filename = path.resolve(path.join(__dirname, './cache', `${key}.html`));

  try {
    fs.accessSync(filename, fs.constants.R_OK);
    console.log('Reading from cache');

    const stats = fs.statSync(filename);
    const mtime = new Date(stats.mtime).getTime();

    if (mtime + CACHE_STALE_TIME > Date.now()) {
      const data = fs.readFileSync(filename, 'utf-8');
      return cheerio.load(data);
    } else {
      console.log('Cache stale, will request.');
    }
  } catch (err) {
    console.error('Cache Empty, will request.');
  }

  try {
    const html = await request(url);
    await writeAsync(filename, html);

    return cheerio.load(html);
  } catch (e) {
    console.log(chalk.bgWhite.red('Request failed.'));
    console.error(e);
    process.exit(1);
  }
}
