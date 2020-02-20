import React from 'react';

import NewTabLink from 'meiko/NewTabLink';

import './Footer.scss';

const currentYear = new Date().getFullYear();

const Footer = React.memo(() => (
  <footer className="footer">
    <p>Pokémon is © of Nintendo, 1995-{currentYear}.</p>
    <p>
      Inspired by another{' '}
      <NewTabLink href="https://richi3f.github.io/pokemon-team-planner/national_dex.html">
        Pokémon Team Planner
      </NewTabLink>
    </p>
    <p>
      Source code can be found{' '}
      <NewTabLink href="https://github.com/bakuzan/lusamine">here</NewTabLink>
    </p>
  </footer>
));

export default Footer;
