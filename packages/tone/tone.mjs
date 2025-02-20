/*
tone.mjs - <short description TODO>
Copyright (C) 2022 Strudel contributors - see <https://github.com/tidalcycles/strudel/blob/main/packages/tone/tone.mjs>
This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version. This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details. You should have received a copy of the GNU Affero General Public License along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

import { Pattern } from '@strudel.cycles/core';
import * as _Tone from 'tone';

// import Tone from here, to make sure to get the same AudioContext
export const Tone = _Tone;

const {
  AutoFilter,
  Destination,
  Filter,
  Gain,
  isNote,
  Synth,
  PolySynth,
  MembraneSynth,
  MetalSynth,
  MonoSynth,
  AMSynth,
  DuoSynth,
  FMSynth,
  NoiseSynth,
  PluckSynth,
  Sampler,
  getDestination,
  Players,
} = Tone;
import * as tonePiano from '@tonejs/piano';
const { Piano } = tonePiano;
import { getPlayableNoteValue } from '@strudel.cycles/core/util.mjs';

// "balanced" | "interactive" | "playback";
// Tone.setContext(new Tone.Context({ latencyHint: 'playback', lookAhead: 1 }));
export const getDefaultSynth = () => {
  const s = new PolySynth().chain(new Gain(0.5), getDestination());
  s.set({
    oscillator: { type: 'triangle' },
    envelope: {
      release: 0.01,
    },
  });
  return s;
};

// what about
// https://www.charlie-roberts.com/gibberish/playground/

// with this function, you can play the pattern with any tone synth
Pattern.prototype.tone = function (instrument) {
  return this._withEvent((event) => {
    const onTrigger = (time, event) => {
      let note;
      let velocity = event.context?.velocity ?? 0.75;
      if (instrument instanceof PluckSynth) {
        note = getPlayableNoteValue(event);
        instrument.triggerAttack(note, time);
      } else if (instrument instanceof NoiseSynth) {
        instrument.triggerAttackRelease(event.duration.valueOf(), time); // noise has no value
      } else if (instrument instanceof Piano) {
        note = getPlayableNoteValue(event);
        instrument.keyDown({ note, time, velocity });
        instrument.keyUp({ note, time: time + event.duration.valueOf(), velocity });
      } else if (instrument instanceof Sampler) {
        note = getPlayableNoteValue(event);
        instrument.triggerAttackRelease(note, event.duration.valueOf(), time, velocity);
      } else if (instrument instanceof Players) {
        if (!instrument.has(event.value)) {
          throw new Error(`name "${event.value}" not defined for players`);
        }
        const player = instrument.player(event.value);
        // velocity ?
        player.start(time);
        player.stop(time + event.duration.valueOf());
      } else {
        note = getPlayableNoteValue(event);
        instrument.triggerAttackRelease(note, event.duration.valueOf(), time, velocity);
      }
    };
    return event.setContext({ ...event.context, instrument, onTrigger });
  });
};

Pattern.prototype.define('tone', (type, pat) => pat.tone(type), { composable: true, patternified: false });

// synth helpers
export const amsynth = (options) => new AMSynth(options);
export const duosynth = (options) => new DuoSynth(options);
export const fmsynth = (options) => new FMSynth(options);
export const membrane = (options) => new MembraneSynth(options);
export const metal = (options) => new MetalSynth(options);
export const monosynth = (options) => new MonoSynth(options);
export const noise = (options) => new NoiseSynth(options);
export const pluck = (options) => new PluckSynth(options);
export const polysynth = (options) => new PolySynth(options);
export const sampler = (options, baseUrl) =>
  new Promise((resolve) => {
    const s = new Sampler(options, () => resolve(s), baseUrl);
  });
export const players = (options, baseUrl = '') => {
  options = !baseUrl
    ? options
    : Object.fromEntries(Object.entries(options).map(([key, value]) => [key, baseUrl + value]));
  return new Promise((resolve) => {
    const s = new Players(options, () => resolve(s));
  });
};
export const synth = (options) => new Synth(options);
export const piano = async (options = { velocities: 1 }) => {
  const p = new Piano(options);
  await p.load();
  return p;
};

// effect helpers
export const vol = (v) => new Gain(v);
export const lowpass = (v) => new Filter(v, 'lowpass');
export const highpass = (v) => new Filter(v, 'highpass');
export const adsr = (a, d = 0.1, s = 0.4, r = 0.01) => ({ envelope: { attack: a, decay: d, sustain: s, release: r } });
export const osc = (type) => ({ oscillator: { type } });
export const out = () => getDestination();
