import React from 'react';

import { NewTabLink } from 'meiko';

import './Footer.css';

const Footer = props => {
  return (
    <section className="footer">
      <p>
        Inspired by another{' '}
        <NewTabLink href="https://richi3f.github.io/pokemon-team-planner/national_dex.html">
          Pokémon Team Planner
        </NewTabLink>
      </p>
      <p>Pokémon is © of Nintendo, 1995-2017.</p>
    </section>
  );
};

export default Footer;
