import PropTypes from 'prop-types';
import React from 'react';

import List from 'components/List/List';
import TeamMember from 'components/TeamMember/TeamMember';

class Team extends React.Component {
  render() {
    return (
      <section className="team">
        <List
          items={[]}
          itemTemplate={item => <TeamMember key={item.id} data={item} />}
        />
      </section>
    );
  }
}

Team.propTypes = {
  members: PropTypes.arrayOf(PropTypes.object)
};

export default Team;
