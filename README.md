# strudel

[![Strudel test status](https://github.com/tidalcycles/strudel/actions/workflows/test.yml/badge.svg)](https://github.com/tidalcycles/strudel/actions)

An experiment in making a [Tidal](https://github.com/tidalcycles/tidal/) using web technologies. This is unstable software, please tread carefully.

- Try it here: <https://strudel.tidalcycles.org/>
- Tutorial: <https://strudel.tidalcycles.org/tutorial/>
- Technical Blog Post: <https://loophole-letters.vercel.app/strudel>

## Running Locally

After cloning the project, you can run the REPL locally:

```bash
npm run setup
npm run repl
```

## Using Strudel In Your Project

There are multiple npm packages you can use to use strudel, or only parts of it, in your project:

- [`core`](./packages/core/): tidal pattern engine
- [`mini`](./packages/mini): mini notation parser + core binding
- [`eval`](./packages/eval): user code evaluator. syntax sugar + highlighting
- [`tone`](./packages/tone): bindings for Tone.js instruments and effects
- [`osc`](./packages/osc): bindings to communicate via OSC
- [`midi`](./packages/midi): webmidi bindings
- [`tonal`](./packages/tonal): tonal functions
- [`xen`](./packages/xen): microtonal / xenharmonic functions

Click on the package names to find out more about each one.

## Contributing

There are many ways to contribute to this project! See [contribution guide](./CONTRIBUTING.md).

## Community

There is a #strudel channel on the TidalCycles discord: <https://discord.com/invite/HGEdXmRkzT>

You can also ask questions and find related discussions on the tidal club forum: <https://club.tidalcycles.org/>

The discord and forum is shared with the haskell (tidal) and python (vortex) siblings of this project.
