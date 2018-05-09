import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import { Utils } from 'meiko';

import HeaderBar from 'components/HeaderBar/HeaderBar';
import Footer from 'components/Footer/Footer';
import PlannerPage from 'views/PlannerPage';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isPageScrolled: false
    };
  }

  componentDidMount() {
    this.scrollListeners = Utils.Common.createListeners('scroll', () => {
      // check scroll position and setState
    })();
    this.scrollListeners.listen();
  }

  componentWillUnmount() {
    this.scrollListeners.remove();
  }

  render() {
    console.log(this.state);
    return (
      <div className="app app--theme_default">
        <HeaderBar
          title="team planner"
          isPageScrolled={this.state.isPageScrolled}
        />
        <main>
          <Switch>
            <Route path="/saved-teams" />
            <Route path="/" component={PlannerPage} />
          </Switch>
        </main>
        <Footer />
      </div>
    );
  }
}

export default App;
