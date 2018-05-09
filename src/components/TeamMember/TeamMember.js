import PropTypes from 'prop-types';
import classNames from 'classnames';
import React from 'react';

const TeamMember = props => <div className={classNames('team__member')} />;

TeamMember.propTypes = {
  data: PropTypes.object.isRequired
};

export default TeamMember;
