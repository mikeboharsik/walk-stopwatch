import { EVENT_TYPE } from './markButtons';
import { updateStorage } from './updateStorage';

export function getInputChangeHandler(id) {
	return (e, state, lastTimestamp) => {
		const target = state.marks.find(e => e.id === id);
		switch (target.type) {
			case EVENT_TYPE.TAG: {
				target.tag = e.target.value;
				break;
			}
			case EVENT_TYPE.PLATE:
			case EVENT_TYPE.PLATE_MA:
			case EVENT_TYPE.PLATE_ME:
			case EVENT_TYPE.PLATE_NH: {
				target.plate = e.target.value;
				break;
			}
			default: {
				target.name = e.target.value;
			}
		}
		updateStorage(state, lastTimestamp, true);
	}
}