import { applyMiddleware, combineReducers, createStore, Reducer, Store } from "redux";
import { createDynamicMiddlewares } from "redux-dynamic-middlewares";
import thunk from "redux-thunk";
import { inspectAction } from "./inspect";
import buyCard from "./middleware/buy-card";
import initPlayer from "./middleware/init-player";
import phase from "./middleware/phase";
import gainCardReducer from "./reducers/gain-card";
import { State, Action, Middleware, ThunkDispatch } from "./types";
import turn from "./reducers/turn";
import supply from "./reducers/supply";
import players from "./reducers/players";
import drawCards from "./middleware/draw-cards";
import { defaultState } from "./state";
import trashReducer from "./reducers/trash";

const dynamicMiddlewaresInstance = createDynamicMiddlewares<Middleware>()


const logActions: Middleware = store => next => action => {
	console.log(inspectAction(action));
	next(action);
};

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

const reducer = compose(
	sliceReducers,
	gainCardReducer,
	trashReducer
)

const store = createStore(
	reducer,
	applyMiddleware(
		thunk,
		logActions,
		dynamicMiddlewaresInstance.enhancer,
		buyCard,
		initPlayer,
		drawCards,
		phase
	)
)

export const addInterface = (middleware: Middleware) => dynamicMiddlewaresInstance.addMiddleware(middleware)

export default store
