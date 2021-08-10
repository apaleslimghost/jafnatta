import { ThunkDispatch } from "../../types";
import ActionCard from "../action";
import { drawAction, gainAction } from '../../actions';
import { askForSupplyCardAction } from "../../actions/ask-for-supply-card";

export default class Workshop extends ActionCard {
	static cardName = 'Workshop';
	static text = `
		gain
	`;
	static cost = () => 3;

	async onPlay(dispatch: ThunkDispatch) {
        const card = await dispatch(
			askForSupplyCardAction(4)
		);

		if(card) {
            dispatch(gainAction({ card }));
		}

	}
}
