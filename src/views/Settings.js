import React from 'react';

import { Tickbox } from 'meiko-lib';
import SETTINGS_DEFAULTS from 'constants/settings';
import { settingsStore } from 'utils/common';

class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ...SETTINGS_DEFAULTS
    };

    this.handleUserInput = this.handleUserInput.bind(this);
  }

  componentDidMount() {
    this.setState({ ...settingsStore.get() });
  }

  handleUserInput(e) {
    const { name, checked } = e.target;
    this.setState({ [name]: checked }, () =>
      settingsStore.set({
        ...SETTINGS_DEFAULTS,
        ...this.state
      })
    );
  }

  render() {
    const settings = this.state;

    return (
      <div className="settings">
        <Tickbox
          id="can-dnd"
          className="settings__input"
          name="canDragAndDrop"
          text={`Enable Drag and Drop\nMove Team Members by dragging the cards to the desired spot.`}
          checked={settings.canDragAndDrop}
          onChange={this.handleUserInput}
        />
        <Tickbox
          id="can-use-arrows"
          className="settings__input"
          name="canUseArrows"
          text={`Enable Team Member Arrows\nMove Team Members with arrow buttons to the desired spot.`}
          checked={settings.canUseArrows}
          onChange={this.handleUserInput}
        />
        <Tickbox
          id="can-evolve"
          className="settings__input"
          name="canEvolve"
          text={`Enable Team Member Evolve\nChange Team Members with their evolutions with this shortcut.`}
          checked={settings.canEvolve}
          onChange={this.handleUserInput}
        />
      </div>
    );
  }
}

export default Settings;
