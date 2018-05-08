import React from 'react';

import List from 'components/List/List';

class Team extends React.Component {
  render() {
    return (
      <section className="team">
        <List
          items={[]}
          itemTemplate={(item, i) => {
            return <div key={i}>placeholder</div>;
          }}
        />
      </section>
    );
  }
}

export default Team;
