import React, { useState, useContext, useMemo } from 'react';

import TeamViewerMessage from 'components/TeamViewerMessage';
import TypeBlock from 'components/TypeBlock';
import StatsTable from './StatsTable';
import PokemonContent from './PokemonContent';
import { PokedexContext, TypeContext } from 'context';
import { teamsStore } from 'utils/common';
import groupBy from 'utils/groupBy';
import calculateCounts, { mapToSortedArray } from './calculateCounts';

import './TeamStatistics.scss';

function TeamStatistics() {
  const { pokedex } = useContext(PokedexContext);
  const typesData = useContext(TypeContext);
  const [savedTeams] = useState(teamsStore.get());
  const [expandedPokemonRow, setExpandedPokemon] = useState(new Set([]));

  const teamsCount = savedTeams ? Object.keys(savedTeams).length : 0;
  const displayViewerMessage = teamsCount === 0;

  const {
    totalPokemonCount,
    groupedPokemon,
    pokemon,
    types,
    generations,
    evolutionForms
  } = useMemo(() => calculateCounts(pokedex, savedTeams), [
    pokedex,
    savedTeams
  ]);

  if (displayViewerMessage) {
    return <TeamViewerMessage />;
  }

  return (
    <div className="team-statistics">
      <div>
        <h2 className="team-statistics__title">Team Statistics</h2>
        <p className="team-statistics__description">
          This page shows the detailed breakdown for all currently saved teams.
          {`\n`} It should also be noted that type counts include a count for
          each type, meaning that a pokemon with 2 types are counted once for
          each type.{`\n`} The current statistics are representative of{' '}
          {totalPokemonCount} pokemon across {teamsCount} teams.
        </p>
      </div>
      <div className="team-statistics__data">
        <StatsTable
          label="Pokemon"
          striped={false}
          hovered={false}
          headers={
            <tr>
              <th className="center-align">Pokemon</th>
              <th className="right-align">Count</th>
            </tr>
          }
        >
          {groupedPokemon.map(([key, count]) => {
            const npn = `p_${key}`;
            const p = pokedex.get(npn);
            const isExpanded = expandedPokemonRow.has(key);
            const pokemonSublist = mapToSortedArray(
              groupBy(pokemon.get(key), (x) => x.id)
            );

            return (
              <React.Fragment key={key}>
                <tr key={key}>
                  <td className="center-align">
                    <PokemonContent
                      isExpanded={isExpanded}
                      data={p}
                      onToggle={() => {
                        setExpandedPokemon(
                          (expanded) =>
                            new Set(
                              expanded.delete(key)
                                ? expanded
                                : expanded.add(key)
                            )
                        );
                      }}
                    />
                  </td>
                  <td className="right-align">{count}</td>
                </tr>
                {isExpanded &&
                  pokemonSublist.map(([subKey, count]) => {
                    const subP = pokedex.get(subKey);

                    return (
                      <tr key={subKey} className="statistics__expanded-row">
                        <td className="center-align">
                          <PokemonContent data={subP} />
                        </td>
                        <td className="right-align">{count}</td>
                      </tr>
                    );
                  })}
              </React.Fragment>
            );
          })}
        </StatsTable>
        <div>
          <div className="team-statistics__data-inner">
            <StatsTable
              label="Types"
              headers={
                <tr>
                  <th className="center-align">Type</th>
                  <th className="right-align">Count</th>
                </tr>
              }
            >
              {types.map(([key, count]) => {
                const t = typesData.get(key);
                return (
                  <tr key={key}>
                    <td>
                      <TypeBlock center value={t.name} />
                    </td>
                    <td className="right-align">{count}</td>
                  </tr>
                );
              })}
            </StatsTable>
            <StatsTable
              label="Generations"
              headers={
                <tr>
                  <th>Generation</th>
                  <th className="right-align">Count</th>
                </tr>
              }
            >
              {generations.map(([key, count]) => (
                <tr key={key}>
                  <td>{key}</td>
                  <td className="right-align">{count}</td>
                </tr>
              ))}
            </StatsTable>
            <StatsTable
              label="Evolutions"
              headers={
                <tr>
                  <th>Evolution</th>
                  <th className="right-align">Count</th>
                </tr>
              }
            >
              {evolutionForms.map(({ label, count }) => (
                <tr key={label}>
                  <td>{label}</td>
                  <td className="right-align">{count}</td>
                </tr>
              ))}
            </StatsTable>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TeamStatistics;
