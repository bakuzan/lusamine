import React from 'react';

import NewTabLink from 'meiko/NewTabLink';

import './Footer.scss';

const currentYear = new Date().getFullYear();

const Footer = React.memo(() => (
  <section className="footer">
    <p>
      Inspired by another{' '}
      <NewTabLink href="https://richi3f.github.io/pokemon-team-planner/national_dex.html">
        Pokémon Team Planner
      </NewTabLink>
    </p>
    <p>Pokémon is © of Nintendo, 1995-{currentYear}.</p>
  </section>
));

export default Footer;
