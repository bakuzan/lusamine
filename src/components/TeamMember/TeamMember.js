import PropTypes from 'prop-types';
import classNames from 'classnames';
import React from 'react';

import ArtCard from 'components/ArtCard/ArtCard';
import TypeBlock from 'components/TypeBlock/TypeBlock';
import { capitaliseEachWord } from 'utils/common';

import './TeamMember.css';

const TeamMember = ({ data, isSelected, ...props }) => {
  return (
    <li
      className={classNames('team-member', {
        'team-member--selected': isSelected
      })}
    >
      <ArtCard data={data} />
      <div className={classNames('team-member__name-bubble')}>
        {capitaliseEachWord(data.name)}
      </div>
      <div className={classNames('team-member__types')}>
        {data.types.map(type => <TypeBlock key={type.id} value={type.name} />)}
      </div>
    </li>
  );
};

TeamMember.propTypes = {
  data: PropTypes.object.isRequired,
  isSelected: PropTypes.bool,
  onClick: PropTypes.func
};

export default TeamMember;
