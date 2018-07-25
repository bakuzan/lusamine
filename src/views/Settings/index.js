import React from 'react';

import { Tickbox } from 'meiko';
import SETTINGS_DEFAULTS from 'constants/settings';
import { getSettings, saveSettings } from 'utils/common';

class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ...SETTINGS_DEFAULTS
    };

    this.handleUserInput = this.handleUserInput.bind(this);
  }

  componentDidMount() {
    this.setState({ ...getSettings() });
  }

  handleUserInput(e) {
    const { name, checked } = e.target;
    this.setState({ [name]: checked }, () =>
      saveSettings({
        ...SETTINGS_DEFAULTS,
        ...this.state.settings
      })
    );
  }

  render() {
    const settings = this.state;
    return (
      <div className="settings">
        <Tickbox
          name="canDragAndDrop"
          text="Enable Drag and Drop"
          checked={settings.canDragAndDrop}
          onChange={this.handleUserInput}
        />
      </div>
    );
  }
}

export default Settings;
