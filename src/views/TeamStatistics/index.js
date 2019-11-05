import React, { useState, useContext, useMemo } from 'react';

import { capitaliseEachWord } from 'ayaka/capitalise';
import ArtCard from 'components/ArtCard';
import TeamViewerMessage from 'components/TeamViewerMessage';
import TypeBlock from 'components/TypeBlock';
import StatsTable from './StatsTable';
import { PokedexContext, TypeContext } from 'context';
import { teamsStore } from 'utils/common';
import calculateCounts from './calculateCounts';

import './TeamStatistics.scss';

function TeamStatistics() {
  const { pokedex } = useContext(PokedexContext);
  const typesData = useContext(TypeContext);
  const [savedTeams] = useState(teamsStore.get());

  const { pokemon, types, generations, evolutionForms } = useMemo(
    () => calculateCounts(pokedex, savedTeams),
    [pokedex, savedTeams]
  );

  /* TODO
   * Drilldown on pokemon table to see which pokemon
   *  i.e Pokemon table shows Gardevoir -> 4
   *    The drilldown would show
   *      Mega Gardevoir -> 3
   *      Gardevoir -> 1
   */

  if (!savedTeams || Object.keys(savedTeams).length === 0) {
    return <TeamViewerMessage />;
  }

  return (
    <div className="team-statistics">
      <div>
        <h2 className="team-statistics__title">Team Statistics</h2>
        <p className="team-statistics__description">
          This page shows the detailed breakdown for all currently saved teams.
          {`\n`}
          All Pokemon forms are counted under the parent level pokemon, i.e Mega
          Gardevoir would add 1 to the Gardevoir count.
          {`\n`} It should also be noted that type counts include a count for
          each type, meaning that a pokemon with 2 types are counted once for
          each type.
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
          {pokemon.map(([key, count]) => {
            const p = pokedex.get(`p_${key}`);
            return (
              <tr key={key}>
                <td className="center-align">
                  <ArtCard containerClass="team-statistics__card" data={p} />
                  <div>{capitaliseEachWord(p.name)}</div>
                </td>
                <td className="right-align">{count}</td>
              </tr>
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
