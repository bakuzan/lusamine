import React, { useRef } from 'react';

import { ClearButton } from 'components/Buttons';
import { useKonami } from 'hooks/useKonami';
import pokemonOpening from 'assets/pokemon-opening.mp3';

import './EasterEgg.scss';

function EasterEgg() {
  const audio = useRef();
  const [usedKonamiCode, reset] = useKonami();

  if (!usedKonamiCode) {
    return null;
  }

  const isPaused = audio.current && audio.current.paused;

  return (
    <div className="easter-egg">
      <div className="easter-egg__player">
        <label className="easter-egg__label" htmlFor="easter-egg">
          {`${isPaused ? 'Paused' : 'Now Playing'}: Pokemon Theme`}
        </label>
        <audio
          ref={audio}
          id="easter-egg"
          className="easter-egg__audio"
          controls
          autoPlay
        >
          <source src={pokemonOpening} type="audio/mp3" />
        </audio>
      </div>
      <ClearButton
        id="easter-egg-cancel"
        aria-label="Close easter egg"
        btnStyle="primary"
        onClick={reset}
      />
    </div>
  );
}

export default EasterEgg;
