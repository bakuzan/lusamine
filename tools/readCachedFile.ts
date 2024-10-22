import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import got from 'got';
import * as cheerio from 'cheerio';

const writeAsync = promisify(fs.writeFile);

// const ONE_HOUR = 1000 * 60 * 60;
const CACHE_STALE_TIME = Infinity; // ONE_HOUR;

export default async function fetchPage(key: string, url: string) {
  // eslint-disable-next-line no-undef
  const filename = path.resolve(path.join(__dirname, './cache', `${key}.html`));

  try {
    fs.accessSync(filename, fs.constants.R_OK);
    console.log(`Reading ${key} from cache.`);

    const stats = fs.statSync(filename);
    const mtime = new Date(stats.mtime).getTime();

    if (mtime + CACHE_STALE_TIME > Date.now()) {
      const data = fs.readFileSync(filename, 'utf-8');
      return cheerio.load(data);
    } else {
      console.log(`Cache for ${key} is stale, will request.`);
    }
  } catch (err) {
    console.error(`Cache for ${key} is empty, will request.`);
  }

  try {
    const response = await got(url);
    const html = response.body;
    await writeAsync(filename, html);

    return cheerio.load(html);
  } catch (e) {
    console.log(chalk.bgWhite.red(`Request for ${key} failed.`));
    console.error(e);
    // eslint-disable-next-line no-undef
    process.exit(1);
  }
}
