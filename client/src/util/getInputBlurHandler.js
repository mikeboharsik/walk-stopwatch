import { EVENT_TYPE } from './markButtons';

export function getInputBlurHandler(id) {
	return (e, state) => {
		const target = state.marks.find(e => e.id === id);
		switch (target.type) {
			case EVENT_TYPE.PLATE:
			case EVENT_TYPE.PLATE_MA:
			case EVENT_TYPE.PLATE_ME:
			case EVENT_TYPE.PLATE_NH: {
				const upper = e.target.value.toUpperCase();
				if (target.plate !== upper) {
					target.plate = upper;
					delete target.name;
				}
				break;
			}
			default: {}
		}
	}
}