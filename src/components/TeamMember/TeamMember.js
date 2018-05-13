import PropTypes from 'prop-types';
import classNames from 'classnames';
import React from 'react';

import ArtCard from 'components/ArtCard/ArtCard';
import TypeBlock from 'components/TypeBlock/TypeBlock';
import { capitaliseEachWord } from 'utils/common';

const TeamMember = ({ data, ...props }) => {
  return (
    <div
      className={classNames('team__member', {
        'team__member--selected': false
      })}
    >
      <ArtCard data={{}} />
      <div className={classNames('name-bubble')}>
        {capitaliseEachWord(data.name)}
      </div>
      <div>
        {data.types.map(type => <TypeBlock key={type.id} value={type.name} />)}
      </div>
    </div>
  );
};

TeamMember.propTypes = {
  data: PropTypes.object.isRequired
};

export default TeamMember;
