import { Card } from "../cards/types";
import ExternalPromise from "../external-promise";
import { PlayerState, ThunkResult } from "../types";
import { waitForActionAction } from "./wait-for-action";

export const askForCardAction = <C extends typeof Card>(
	from: keyof PlayerState,
	cardType: C
): ThunkResult<Promise<InstanceType<C> | undefined>> => async (dispatch, getState) => {
	const promise = ExternalPromise.create<InstanceType<C> | undefined>()
	dispatch({ type: 'ask-for-card', from, cardType, promise });
	return promise
};
