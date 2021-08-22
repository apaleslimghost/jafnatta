import { applyMiddleware, combineReducers, createStore, Reducer, Store } from "redux";
import { createDynamicMiddlewares } from "redux-dynamic-middlewares";
import thunk from "redux-thunk";
import { inspectAction, inspectState } from "./inspect";
import buyCard from "./middleware/buy-card";
import initPlayer from "./middleware/init-player";
import phase from "./middleware/phase";
import turnMiddleware from "./middleware/turn";
import gainCardReducer from "./reducers/gain-card";
import { State, Action, Middleware, ThunkDispatch } from "./types";
import turn from "./reducers/turn";
import supply from "./reducers/supply";
import players from "./reducers/players";
import drawCards from "./middleware/draw-cards";
import { defaultState } from "./state";
import trashReducer from "./reducers/trash";

const dynamicMiddlewaresInstance = createDynamicMiddlewares<Middleware>()

const sliceReducers: Reducer = (state: State = defaultState, action: Action): State => ({
	turn: turn(state.turn, action),
	supply: supply(state, action),
	players: players(state.players, action),
	trash: state.trash
})

const compose = (...reducers: Reducer[]): Reducer => reducers.reduce(
	(composed, reducer) => (state, action) => composed(reducer(state, action), action),
	(state = defaultState, action) => state
)

const baseReducers = [
	sliceReducers,
	gainCardReducer,
	trashReducer
]

const reducer = compose(...baseReducers)

const store = createStore(
	reducer,
	// defaultState as any,
	applyMiddleware(
		thunk,
		dynamicMiddlewaresInstance.enhancer,
		buyCard,
		initPlayer,
		drawCards,
		phase,
		turnMiddleware,
	)
)

export const addInterface = (middleware: Middleware) => dynamicMiddlewaresInstance.addMiddleware(middleware)

const extraReducers: Reducer[] = []
export const addReducer = (reducer: Reducer) => {
	extraReducers.push(reducer)
	store.replaceReducer(compose(
		...baseReducers,
		...extraReducers
	))
}

export default store
