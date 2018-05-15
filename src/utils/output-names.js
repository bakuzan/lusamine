const parseName = str => str.replace(/ /g, '-').replace(/[.':]/g, '');

export default function getnames(pokedex) {
  console.log(
    Array.from(pokedex).reduce(
      (p, [id, item]) => `${p}\n${parseName(item.name)},`,
      ''
    )
  );
}

// ^.*\.
// \{.*$
