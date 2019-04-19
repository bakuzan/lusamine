import React, { useContext, useMemo } from 'react';

import TeamMember from 'components/TeamMember';
import { LeftButton, RightButton } from 'components/Buttons';
import Routes from 'constants/routes';
import { PokedexContext } from 'context';
import { iterateMapToArray } from 'utils/common';
import { isMegaPokemon, isVariantPokemon } from 'utils/derivedData';

import './Pokedex.scss';

function generateVanillaDex(dex) {
  const values = iterateMapToArray(dex);
  const basePokemon = values.filter(
    (x) => !(isMegaPokemon(x) || isVariantPokemon(x) || !!x.form)
  );

  let lastNPN = 0;
  const baseDex = basePokemon.reduce((p, c) => {
    const npn = c.nationalPokedexNumber;
    lastNPN = npn;
    return p.set(npn, c);
  }, new Map([]));

  return { baseDex, lastNPN };
}

function Pokedex({ match, history, ...props }) {
  const pokedex = useContext(PokedexContext);
  const { baseDex, lastNPN } = useMemo(() => generateVanillaDex(pokedex), []);

  const { params } = match;
  const activeNPN = Number(params.npn) || 1;
  const activeMon = baseDex.get(activeNPN);

  const isFirst = activeNPN === 1;
  const isLast = activeNPN === lastNPN; // TODO real the last number

  function move(direction) {
    const newNPN = activeNPN + direction;
    history.push(`${Routes.base}${Routes.pokedex}/${newNPN}`);
  }

  console.log('RENDER DEX', match, pokedex, baseDex, activeNPN, activeMon);
  return (
    <div className="pokedex">
      <div className="pokedex__controls">
        <LeftButton disabled={isFirst} onClick={() => move(-1)} />

        <RightButton disabled={isLast} onClick={() => move(1)} />
      </div>
      {activeMon && <TeamMember data={activeMon} />}
    </div>
  );
}

export default Pokedex;
