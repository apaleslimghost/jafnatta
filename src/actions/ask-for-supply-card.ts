import { ChooseSupplyCardAction, ThunkResult } from "../types";
import { waitForActionAction } from "./wait-for-action";

export const askForSupplyCardAction = (maxValue: number): ThunkResult<Promise<ChooseSupplyCardAction>> => async (dispatch, getState) => {
	dispatch({ type: 'ask-for-supply-card', maxValue });
	return dispatch(waitForActionAction('choose-supply-card'));
};
