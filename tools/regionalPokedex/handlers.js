const { baseHandler } = require('./helpers');

module.exports = {
  async kanto(name, $) {
    const bodys = Array.from($('table > tbody'))
      .slice(1, -3)
      .filter((_, i) => i !== 3);

    return await baseHandler($, bodys, { number: 1, name });
  },
  async new(name, $) {
    const bodys = Array.from($('table > tbody')).slice(1, -3);

    return await baseHandler($, bodys, { number: 2, name });
  },
  async johto(name, $) {
    const bodys = Array.from($('table > tbody')).slice(1, -3);

    return await baseHandler($, bodys, { number: 2, name, code: 'Johto' });
  },
  async hoenn(name, $) {
    const bodys = Array.from($('table > tbody')).slice(0, -3);

    return await baseHandler($, bodys, { number: 3, name });
  },
  async hoenn_oras(name, $) {
    const bodys = Array.from($('table > tbody')).slice(0, -3);

    return await baseHandler($, bodys, { number: 3, name, code: 'ORAS' });
  }
};
