<h1 align="center">
	<img src="etc/logo.svg" alt="Jafnatta" width="400">
</h1>

An engine for a deckbuilding game.

## Developing

You'll need Node v12 or newer, and npm, which comes bundled with Node. Install the dependencies with `npm install`, then `npm start` will run the compiler testing interface, and watch for changes to the code.

## Architecture

Jafnatta is written in Typescript, and uses Redux and Redux Thunks. Most of the game logic is implemented either as middleware (which can dispatch actions and control the incoming action), or as thunks (which can also dispactch actions, can be waited for by other actions, but can't control the dispact of the current action), with a handful of reducers (which can only alter the state).

The core engine is separate to any user interface. There's an interactive command line interface in [`test.ts`](./test.ts) that demonstrates how an interface communicates with the game engine:

- The engine exposes state that should be displayed to the player
- It will dispatch actions such as `ask-for-card` and `ask-for-supply-card` that should prompt the player to choose a card from the appropriate location
- The interface can do this however it likes, but must dispatch a `choose-card` or `choose-supply-card` action with the selected card.

In the future there'll be a split between a core engine and a player engine, to hide sensitive information like deck order and opponent cards.

## Still to implement

- [ ] Multiple players
- [ ] Game end conditions
- [ ] Information hiding

## Licence

[Parity Public Licence, 7.0.0](licence.md)
