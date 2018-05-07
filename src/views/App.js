import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import './App.css';

class App extends Component {
  render() {
    return (
      <div>
        <main>
          <Switch>
            <Route exact path="/" />
          </Switch>
        </main>
      </div>
    );
  }
}

export default App;
