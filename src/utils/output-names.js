export default function getnames(pokedex) {
  console.log(
    Array.from(pokedex).reduce(
      (p, [id, item]) => `${p}\n${item.name.replace(' ', '-')},`,
      ''
    )
  );
}
