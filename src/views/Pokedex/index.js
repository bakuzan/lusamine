import React, { useContext, useMemo } from 'react';

import { List as MkoList, SelectBox, useWindowSize } from 'mko';
import { Button } from 'components/Buttons';
import TeamMember from 'components/TeamMember';
import TeamBreakdown from 'components/TeamBreakdown';
import List from 'components/List';
import Routes from 'constants/routes';
import { PokedexContext } from 'context';
import { iterateMapToArray, capitaliseEachWord } from 'utils/common';
import { isMegaPokemon, isVariantPokemon } from 'utils/derivedData';
import generateEvolutionOptions from 'utils/generateEvolutionOptions';
import { isXS } from 'utils/media';

import './Pokedex.scss';

const FIRST_ID = `p_1`;

function generateVanillaDex(dex) {
  const values = iterateMapToArray(dex);
  const basePokemon = values.filter(
    (x) => !(isMegaPokemon(x) || isVariantPokemon(x))
  );

  let lastId = 0;
  const baseDex = basePokemon.reduce((p, c) => {
    const id = c.id;
    lastId = id;
    return p.set(id, c);
  }, new Map([]));

  return {
    baseDex,
    dexOptions: iterateMapToArray(baseDex).map((x) => ({
      value: x.id,
      text: `${capitaliseEachWord(x.name)} (#${x.nationalPokedexNumber})`
    })),
    lastId
  };
}

function buildControlText(dex, dexOptions, activeId) {
  const index = dexOptions.findIndex((x) => x.value === activeId);

  return [-1, 1].map((direction) => {
    const data = dexOptions[index + direction];

    if (!data) {
      return { label: 'End of pokedex', text: '' };
    }

    const mon = dex.get(data.value);

    const isPre = direction < 0;
    const pref = isPre ? '< ' : '';
    const suff = isPre ? '' : ' >';

    const npn = mon.nationalPokedexNumber;
    const monName = capitaliseEachWord(mon.name);

    const text = `${pref}#${npn} - ${monName}${suff}`;
    const label = `Go to #${npn}, ${monName}`;

    return { label, text };
  });
}

function Pokedex({ match, history }) {
  const pokedex = useContext(PokedexContext);
  const { baseDex, dexOptions, lastId } = useMemo(
    () => generateVanillaDex(pokedex),
    []
  );

  const size = useWindowSize();
  const isXSmall = isXS(size.width);

  const { params } = match;
  const activeId = params.id || FIRST_ID;
  const activeMon = baseDex.get(activeId);

  const isFirst = activeId === FIRST_ID;
  const isLast = activeId === lastId;

  function changeActivePokemon(e) {
    const newId = e.target.value;
    history.push(`${Routes.base}${Routes.pokedex}/${newId}`);
  }

  if (!activeMon) {
    return (
      <div className="pokedex pokedex--not-found">
        <div className="pokedex__not-found-message">
          No Pokemon was found. Select a valid one below.
        </div>
        <SelectBox
          id="active-pokemon"
          containerClassName="pokedex__options"
          text="Active Pokemon"
          value={activeId}
          options={dexOptions}
          onChange={changeActivePokemon}
        />
      </div>
    );
  }

  const [backward, forward] = buildControlText(baseDex, dexOptions, activeId);
  const { devolves, evolves, megas, variants } = generateEvolutionOptions(
    pokedex,
    activeMon,
    true
  );

  const hasDevolves = !!devolves.length;
  const hasEvolves = !!evolves.length;
  const hasMegas = !!megas.length;

  function move(direction) {
    const index = dexOptions.findIndex((x) => x.value === activeId);
    const mon = dexOptions[index + direction];
    history.push(`${Routes.base}${Routes.pokedex}/${mon.value}`);
  }

  return (
    <div className="pokedex">
      <div className="pokedex__controls">
        <Button
          className="pokedex__nav-button"
          title={backward.label}
          aria-label={backward.label}
          disabled={isFirst}
          onClick={() => move(-1)}
        >
          {isFirst ? '' : backward.text}
        </Button>
        {!isXSmall && (
          <SelectBox
            id="active-pokemon"
            containerClassName="pokedex__options"
            text="Active Pokemon"
            value={activeId}
            options={dexOptions}
            onChange={changeActivePokemon}
          />
        )}
        <Button
          className="pokedex__nav-button"
          title={forward.label}
          aria-label={forward.label}
          disabled={isLast}
          onClick={() => move(1)}
        >
          {isLast ? '' : forward.text}
        </Button>
        {isXSmall && (
          <SelectBox
            id="active-pokemon"
            containerClassName="pokedex__options"
            text="Active Pokemon"
            value={activeId}
            options={dexOptions}
            onChange={changeActivePokemon}
          />
        )}
      </div>
      {activeMon && <TeamMember data={activeMon} />}
      <div className="pokedex__information pokemon-information">
        <MkoList className="pokemon-information__block pokemon-information__block--large evolution-tree">
          {hasDevolves && (
            <li>
              <List
                className="evolution-tree__list"
                columns={1}
                items={devolves}
                itemTemplate={([_, item]) => (
                  <TeamMember
                    key={item.id}
                    className="pokedex__member"
                    data={item}
                  />
                )}
              />
            </li>
          )}
          {hasDevolves && <li className="evolution-tree__arrow" />}
          <li>
            <List
              className="evolution-tree__list"
              columns={1}
              items={variants}
              itemTemplate={(item) => (
                <TeamMember
                  key={item.id}
                  className="pokedex__member"
                  data={item}
                />
              )}
            />
          </li>
          {hasEvolves && <li className="evolution-tree__arrow" />}
          {hasEvolves && (
            <li>
              <List
                className="evolution-tree__list"
                columns={1}
                items={evolves}
                itemTemplate={([_, item]) => (
                  <TeamMember
                    className="pokedex__member"
                    key={item.id}
                    data={item}
                  />
                )}
              />
            </li>
          )}
          {hasMegas && (
            <li className="evolution-tree__megas">
              <List
                className="evolution-tree__list"
                columns={1}
                items={megas}
                itemTemplate={([_, item]) => (
                  <TeamMember
                    className="pokedex__member"
                    key={item.id}
                    data={item}
                  />
                )}
              />
            </li>
          )}
        </MkoList>
        <div className="pokemon-information__block">
          <TeamBreakdown
            className="pokedex-breakdown"
            contentClassName="pokedex-breakdown__content"
            alwaysOpen
            filterZeroes
            typeBreakdownOnly
            members={new Map([[activeMon.id, activeMon]])}
          />
        </div>
      </div>
    </div>
  );
}

export default Pokedex;
