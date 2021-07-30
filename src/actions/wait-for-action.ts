import ExternalPromise from "../external-promise";
import { ActionFromType, ActionType, ThunkDispatch, ThunkResult } from "../types";

export const waitForActionAction = <T extends ActionType>(action: T): ThunkResult<Promise<ActionFromType<T>>> => (
	dispatch,
	getState
) => {
	const promise: ExternalPromise<ActionFromType<T>> = ExternalPromise.create();
	dispatch({ type: 'wait-for-action', action, promise });
	return promise;
};
