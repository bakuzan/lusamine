const { baseHandler } = require('./helpers');

module.exports = {
  async kanto(name, $) {
    const bodys = Array.from($('table > tbody'))
      .slice(0, -3)
      .filter((_, i) => i !== 4);

    return await baseHandler($, bodys, { number: 1, name });
  },
  async new(name, $) {
    const bodys = Array.from($('table > tbody')).slice(0, -3);

    return await baseHandler($, bodys, { number: 2, name });
  },
  async johto(name, $) {
    const bodys = Array.from($('table > tbody')).slice(0, -3);

    return await baseHandler($, bodys, { number: 2, name, code: 'Johto' });
  },
  async hoenn(name, $) {
    const bodys = Array.from($('table > tbody')).slice(0, -3);

    return await baseHandler($, bodys, { number: 3, name });
  },
  async hoenn_oras(name, $) {
    const bodys = Array.from($('table > tbody')).slice(0, -3);

    return await baseHandler($, bodys, { number: 3, name, code: 'ORAS' });
  },
  async sinnoh(name, $) {
    const bodys_pt = Array.from($('table > tbody')).slice(0, -3);
    const bodys = bodys_pt.slice(0, -1);

    await baseHandler($, bodys, { number: 4, name });
    return await baseHandler($, bodys_pt, {
      number: 4,
      name: `${name}_pt`,
      code: 'Platinum'
    });
  },
  async unova(name, $) {
    const bodys = Array.from($('table > tbody')).slice(0, -3);

    return await baseHandler($, bodys, { number: 5, name });
  },
  async unova_n(name, $) {
    const bodys = Array.from($('table > tbody')).slice(0, -3);

    return await baseHandler($, bodys, { number: 5, name, code: 'New' });
  }
};
