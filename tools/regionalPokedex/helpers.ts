import fs from 'fs';
import path from 'path';
import { filterFalsey, checkImgForVariant } from '@/utils';
import { DummyCheerioTextContainer } from '@/types/DummyCheerioTextContainer';

interface HandlerRegion {
  name: string;
  number: number;
  code?: string;
}

interface RegionEntry {
  region: number;
  code: string | null;
  regionalPokedexNumber: number;
  nationalPokedexNumber: number;
  sublistings?: { number: number | null }[];
  formSuffix: string;
  isVariant: boolean;
}

export function writeOut(name: string, json: any): Promise<boolean> {
  const fileName = path.resolve(path.join(__dirname, `../output/${name}.json`));

  return new Promise((resolve) => {
    fs.writeFile(fileName, JSON.stringify(json, null, 2), function (err) {
      if (err) {
        console.error(`Failed to write ${fileName}`, err);
        return resolve(false);
      }

      console.log(`Successfully written ${fileName}`);
      return resolve(true);
    });
  });
}

function cleanNumber(td: DummyCheerioTextContainer) {
  return Number(td.text().trim().slice(1));
}

function dummyCheerio(value: number) {
  return { text: () => `${value}` };
}

export async function baseHandler(
  $: cheerio.Root,
  bodys: cheerio.Element[],
  region: HandlerRegion
) {
  const ids: Record<string, number | undefined> = {};
  let prevItem = { regionalPokedexNumber: 0, nationalPokedexNumber: 0 };

  const json = bodys.reduce(
    (result, body) => {
      const rows = Array.from($('tr', body));

      const items = rows.map((tr, idx) => {
        if (idx === 0) {
          return null;
        }

        const tds = $(tr).children();
        let reg: DummyCheerioTextContainer = tds.eq(0);
        let nat: DummyCheerioTextContainer = tds.eq(1);
        let img = tds.eq(2);

        const childrenCount = tds.length;
        const isSubForm = childrenCount < 5;

        if (isSubForm) {
          reg = dummyCheerio(prevItem.regionalPokedexNumber);
          nat = dummyCheerio(prevItem.nationalPokedexNumber);
          img = tds.eq(0);
        }

        const isVariant = !!checkImgForVariant(img);
        const nationalPokedexNumber = cleanNumber(nat);
        const npnCode = isVariant
          ? `v_${nationalPokedexNumber}_r${region.number}`
          : `p_${nationalPokedexNumber}`;

        const formNumber = ids[npnCode] ?? 0;
        ids[npnCode] = formNumber + 1;

        const item = {
          region: region.number,
          code: region.code || null,
          regionalPokedexNumber: cleanNumber(reg),
          nationalPokedexNumber,
          formSuffix: formNumber ? `_${formNumber}` : '',
          isVariant
        };

        prevItem = { ...item };

        return item;
      });

      return [...result, ...items];
    },
    [] as (RegionEntry | null)[]
  );

  const data = json.filter(filterFalsey);
  return await writeOut(region.name, data);
}

export async function islandHandler(
  $: cheerio.Root,
  bodys: cheerio.Element[],
  region: HandlerRegion
) {
  const ids: Record<string, number | undefined> = {};

  const json = bodys.reduce(
    (result, body) => {
      const rows = Array.from($('tr', body));

      const items = rows.map((tr, idx) => {
        if (idx === 0) {
          return null;
        }

        const tds = $(tr).children();
        const reg = tds.eq(0);
        const subs = [tds.eq(1), tds.eq(2), tds.eq(3), tds.eq(4)];
        const nat = tds.eq(5);
        const img = tds.eq(6);

        if (!reg || !nat) {
          return null;
        }

        const isVariant = !!checkImgForVariant(img);
        const nationalPokedexNumber = cleanNumber(nat);
        const npnCode = isVariant
          ? `v_${nationalPokedexNumber}_r${region.number}`
          : `p_${nationalPokedexNumber}`;

        const formNumber = ids[npnCode] ?? 0;
        ids[npnCode] = formNumber + 1;

        return {
          region: region.number,
          code: region.code || null,
          regionalPokedexNumber: cleanNumber(reg),
          nationalPokedexNumber,
          sublistings: subs.map((td) => ({ number: cleanNumber(td) || null })),
          formSuffix: formNumber ? `_${formNumber}` : '',
          isVariant
        };
      });

      return [...result, ...items];
    },
    [] as (RegionEntry | null)[]
  );

  const data = json.filter((x) => x !== null);
  return await writeOut(region.name, data);
}

export async function areaHandler(
  $: cheerio.Root,
  bodys: cheerio.Element[],
  region: HandlerRegion
) {
  const ids: Record<string, number | undefined> = {};

  const json = bodys.reduce(
    (result, body) => {
      const rows = Array.from($('tr', body));

      const items = rows.map((tr, idx) => {
        if (idx === 0) {
          return null;
        }

        const tds = $(tr).children();
        const reg = tds.eq(0);
        const subs = [tds.eq(1), tds.eq(2), tds.eq(3), tds.eq(4), tds.eq(5)];
        const nat = tds.eq(6);
        const img = tds.eq(7);

        if (!reg || !nat) {
          return null;
        }

        const isVariant = !!checkImgForVariant(img);
        const nationalPokedexNumber = cleanNumber(nat);
        const npnCode = isVariant
          ? `v_${nationalPokedexNumber}_r${region.number}`
          : `p_${nationalPokedexNumber}`;

        const formNumber = ids[npnCode] ?? 0;
        ids[npnCode] = formNumber + 1;

        return {
          region: region.number,
          code: region.code || null,
          regionalPokedexNumber: cleanNumber(reg),
          nationalPokedexNumber,
          sublistings: subs.map((td) => ({
            number: !!td.text().trim() ? cleanNumber(reg) : null
          })),
          formSuffix: formNumber ? `_${formNumber}` : '',
          isVariant
        };
      });

      return [...result, ...items];
    },
    [] as (RegionEntry | null)[]
  );

  const data = json.filter((x) => x !== null);
  return await writeOut(region.name, data);
}
