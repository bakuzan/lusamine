import React, { useContext, useMemo } from 'react';

import { capitaliseEachWord } from 'ayaka/capitalise';
import { default as MkoList } from 'meiko/List';
import SelectBox from 'meiko/SelectBox';
import { useWindowSize } from 'meiko/hooks/useWindowSize';

import { Button } from 'components/Buttons';
import TeamMember from 'components/TeamMember';
import TeamBreakdown from 'components/TeamBreakdown';
import List from 'components/List';
import PokedexMember from './PokedexMember';

import { PokedexContext } from 'context';
import Routes from 'constants/routes';
import { getUrlQueryStringAsObject } from 'utils/common';
import generateEvolutionOptions from 'utils/generateEvolutionOptions';
import { isXS } from 'utils/media';
import { merge, distinct } from 'utils/lists';
import buildControlText from './buildControlText';
import generateVanillaDex from './generateVanillaDex';

import './Pokedex.scss';

const FIRST_ID = `p_1`;

function Pokedex({ match, location, history }) {
  const { pokedex } = useContext(PokedexContext);
  const { baseDex, dexOptions, lastId } = useMemo(
    () => generateVanillaDex(pokedex),
    [pokedex]
  );

  const size = useWindowSize();
  const isXSmall = isXS(size.width);

  const { params } = match;
  const activeId = params.id || FIRST_ID;
  const activeMon = baseDex.get(activeId);

  const { typeSourceId } = getUrlQueryStringAsObject(location);
  const typeSourceMon = pokedex.get(typeSourceId) || activeMon;

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
  const evoOptions = generateEvolutionOptions(pokedex, activeMon, true);
  const { devolves, evolves, megas, variants, forms } = evoOptions;

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
          <span aria-hidden="true">{isFirst ? '' : backward.text}</span>
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
          <span aria-hidden="true">{isLast ? '' : forward.text}</span>
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
                  <PokedexMember
                    key={item.id}
                    data={item}
                    currentPath={match.url}
                  />
                )}
              />
            </li>
          )}
          {hasDevolves && (
            <li className="evolution-tree__arrow" aria-label="Evolves to" />
          )}
          <li>
            <List
              className="evolution-tree__list"
              columns={1}
              items={distinct('id', merge(variants, forms))}
              itemTemplate={(item) => (
                <PokedexMember
                  key={item.id}
                  data={item}
                  currentPath={match.url}
                />
              )}
            />
          </li>
          {hasEvolves && (
            <li className="evolution-tree__arrow" aria-label="Evolves to" />
          )}
          {hasEvolves && (
            <li>
              <List
                className="evolution-tree__list"
                columns={1}
                items={evolves}
                itemTemplate={([_, item]) => (
                  <PokedexMember
                    key={item.id}
                    data={item}
                    currentPath={match.url}
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
                  <PokedexMember
                    key={item.id}
                    data={item}
                    currentPath={match.url}
                  />
                )}
              />
            </li>
          )}
        </MkoList>
        <section className="pokemon-information__block pokemon-information__block--column">
          <header>
            <h2 className="pokemon-information__title">
              {capitaliseEachWord(
                `${typeSourceMon.name}${
                  typeSourceMon.form
                    ? ` (${capitaliseEachWord(typeSourceMon.form)})`
                    : ''
                } type breakdown`
              )}
            </h2>
          </header>
          <TeamBreakdown
            className="pokedex-breakdown"
            contentClassName="pokedex-breakdown__content"
            alwaysOpen
            filterZeroes
            typeBreakdownOnly
            teamName={typeSourceMon.name}
            members={new Map([[typeSourceMon.id, typeSourceMon]])}
          />
        </section>
      </div>
    </div>
  );
}

export default Pokedex;
