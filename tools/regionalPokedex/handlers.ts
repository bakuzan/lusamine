import { areaHandler, baseHandler, islandHandler } from './helpers';

const handlers: Record<
  string,
  (name: string, $: cheerio.Root) => Promise<boolean>
> = {
  async kanto(name: string, $: cheerio.Root) {
    const bodys = Array.from($('table > tbody'))
      .slice(0, -3)
      .filter((_, i) => i !== 4);

    return await baseHandler($, bodys, { number: 1, name });
  },
  async new(name: string, $: cheerio.Root) {
    const bodys = Array.from($('table > tbody')).slice(0, -3);

    return await baseHandler($, bodys, { number: 2, name });
  },
  async johto(name: string, $: cheerio.Root) {
    const bodys = Array.from($('table > tbody')).slice(0, -3);

    return await baseHandler($, bodys, { number: 2, name, code: 'Johto' });
  },
  async hoenn(name: string, $: cheerio.Root) {
    const bds = Array.from($('table > tbody'));
    const bodys = [...bds.slice(0, 4), ...bds.slice(5, -3)];

    return await baseHandler($, bodys, { number: 3, name });
  },
  async hoenn_oras(name: string, $: cheerio.Root) {
    const bodys = Array.from($('table > tbody')).slice(0, -3);

    return await baseHandler($, bodys, { number: 3, name, code: 'ORAS' });
  },
  async sinnoh(name: string, $: cheerio.Root) {
    const bodys_pt = Array.from($('table > tbody')).slice(0, -3);
    const bodys = bodys_pt.slice(0, -1);

    await baseHandler($, bodys, { number: 4, name });
    return await baseHandler($, bodys_pt, {
      number: 4,
      name: `${name}_pt`,
      code: 'Platinum'
    });
  },
  async unova(name: string, $: cheerio.Root) {
    const bodys = Array.from($('table > tbody')).slice(0, -3);

    return await baseHandler($, bodys, { number: 5, name });
  },
  async unova_n(name: string, $: cheerio.Root) {
    const bodys = Array.from($('table > tbody')).slice(0, -3);

    return await baseHandler($, bodys, { number: 5, name, code: 'New' });
  },
  async kalos(name: string, $: cheerio.Root) {
    const bodys = Array.from($('table > tbody'));
    const central = bodys.slice(0, 4);
    const coastal = bodys.slice(4, 8);
    const mountain = bodys.slice(8, -3);

    await baseHandler($, central, {
      number: 6,
      name: `kalos_ce`,
      code: 'Central'
    });
    await baseHandler($, coastal, {
      number: 6,
      name: `kalos_co`,
      code: 'Coastal'
    });
    return await baseHandler($, mountain, {
      number: 6,
      name: `kalos_mo`,
      code: 'Mountain'
    });
  },
  async alola(name: string, $: cheerio.Root) {
    const bodys = Array.from($('table > tbody')).slice(0, -3);
    return await islandHandler($, bodys, { number: 7, name });
  },
  async alola_u(name: string, $: cheerio.Root) {
    const bodys = Array.from($('table > tbody')).slice(0, -3);
    return await islandHandler($, bodys, { number: 7, name, code: 'Ultra' });
  },
  async galar(name: string, $: cheerio.Root) {
    const bodys = Array.from($('table > tbody')).slice(1, -4);
    return await baseHandler($, bodys, { number: 8, name });
  },
  async galar_isle_of_armor(name: string, $: cheerio.Root) {
    const bodys = Array.from($('table > tbody')).slice(1, -3);
    return await baseHandler($, bodys, {
      number: 8,
      name,
      code: 'Isle of Armor'
    });
  },
  async galar_crown_tundra(name: string, $: cheerio.Root) {
    const bodys = Array.from($('table > tbody')).slice(1, -3);
    return await baseHandler($, bodys, {
      number: 8,
      name,
      code: 'Crown Tundra'
    });
  },
  async hisui(name: string, $: cheerio.Root) {
    const bodys = Array.from($('table > tbody')).slice(1, -3);
    return await areaHandler($, bodys, { number: 8, name, code: 'Hisui' });
  },
  async paldea(name: string, $: cheerio.Root) {
    const bodys = Array.from($('table > tbody')).slice(1, 9);
    return await baseHandler($, bodys, {
      number: 9,
      name,
      code: 'Paldea'
    });
  },
  async kitakami(name: string, $: cheerio.Root) {
    const bodys = Array.from($('table > tbody')).slice(0, 4);
    return await baseHandler($, bodys, {
      number: 9,
      name,
      code: 'Kitakami'
    });
  }
};

export default handlers;
