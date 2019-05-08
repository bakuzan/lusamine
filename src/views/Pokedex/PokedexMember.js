import PropTypes from 'prop-types';
import React from 'react';

import { ButtonisedNavLink } from 'components/Buttons';
import TeamMember from 'components/TeamMember';

function PokedexMember({ currentPath, ...props }) {
  return (
    <TeamMember
      className="pokedex__member"
      {...props}
      renderCustomActions={({ data }) => (
        <ButtonisedNavLink to={`${currentPath}?typeSourceId=${data.id}`}>
          See type breakdown
        </ButtonisedNavLink>
      )}
    />
  );
}

PokedexMember.propTypes = {
  currentPath: PropTypes.string.isRequired
};

export default PokedexMember;
