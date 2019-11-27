import React from 'react';

import SelectBox from 'meiko/SelectBox';
import Tickbox from 'meiko/Tickbox';
import SETTINGS_DEFAULTS from 'constants/settings';
import { pokedexOptions } from 'constants/pokedex';
import { settingsStore } from 'utils/common';

class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ...SETTINGS_DEFAULTS
    };

    this.handleUserInput = this.handleUserInput.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
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

  handleSelectChange(e) {
    const { value } = e.target;
    this.setState({ defaultPokedex: value }, () =>
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
          containerClassName="settings__input"
          name="canDragAndDrop"
          text={`Enable Drag and Drop\nMove team members by dragging the cards to the desired spot.`}
          checked={settings.canDragAndDrop}
          onChange={this.handleUserInput}
        />
        <Tickbox
          id="can-use-arrows"
          containerClassName="settings__input"
          name="canUseArrows"
          text={`Enable Team Member Arrows\nMove team members with arrow buttons to the desired spot.`}
          checked={settings.canUseArrows}
          onChange={this.handleUserInput}
        />
        <Tickbox
          id="can-evolve"
          containerClassName="settings__input"
          name="canEvolve"
          text={`Enable Team Member Evolve\nChange team members with their evolutions with this shortcut.`}
          checked={settings.canEvolve}
          onChange={this.handleUserInput}
        />
        <SelectBox
          id="default-pokedex"
          containerClassName="settings__input settings__input--select-box"
          text="Default Pokedex"
          value={settings.defaultPokedex}
          options={pokedexOptions}
          onChange={this.handleSelectChange}
        />
      </div>
    );
  }
}

export default Settings;
