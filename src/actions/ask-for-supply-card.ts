import { Card } from "../cards/types";
import ExternalPromise from "../external-promise";
import { ThunkResult } from "../types";
import { waitForActionAction } from "./wait-for-action";

export const askForSupplyCardAction = (maxValue: number): ThunkResult<Promise<typeof Card>> => async (dispatch, getState) => {
	const promise = ExternalPromise.create<typeof Card>()
	dispatch({ type: 'ask-for-supply-card', maxValue, promise });
	return promise
};
