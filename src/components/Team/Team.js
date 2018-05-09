import React from 'react';

import List from 'components/List/List';
import TeamMember from 'components/TeamMember/TeamMember';

class Team extends React.Component {
  render() {
    return (
      <section className="team">
        <List
          items={[]}
          itemTemplate={(item, i) => <TeamMember key={i} data={item} />}
        />
      </section>
    );
  }
}

export default Team;
