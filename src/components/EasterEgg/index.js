import React, { useState } from 'react';

import { ClearButton } from 'components/Buttons';
import { useKonami } from 'hooks/useKonami';

import mp3 from 'assets/pokemon-opening.mp3';
import ogg from 'assets/pokemon-opening.ogg';

import './EasterEgg.scss';

function EasterEgg() {
  const [isPlaying, setPlaying] = useState(false);
  const [usedKonamiCode, reset] = useKonami();

  if (!usedKonamiCode) {
    return null;
  }

  return (
    <div className="easter-egg">
      <div className="easter-egg__player">
        <label className="easter-egg__label" htmlFor="easter-egg">
          {`${isPlaying ? 'Now Playing' : 'Paused'}: Pokemon Theme`}
        </label>
        <audio
          id="easter-egg"
          className="easter-egg__audio"
          controls
          autoPlay
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
        >
          <source src={mp3} type="audio/mp3" />
          <source src={ogg} type="audio/ogg" />
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
