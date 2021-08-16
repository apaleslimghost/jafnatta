import { Card } from "../cards/types";
import ExternalPromise from "../external-promise";
import { ChooseOneAction, PlayerState, ThunkResult } from "../types";
import { waitForActionAction } from "./wait-for-action";

export const chooseOneAction =(
	choices: { [key: string]: string }
): ThunkResult<Promise<keyof typeof choices>> => async (dispatch, getState) => {
	const promise = ExternalPromise.create<keyof typeof choices>()
	dispatch({ type: 'choose-one', choices, promise })
	return promise
}
