import { EVENT_TYPE } from './markButtons';

export function getAddMarkHandler(button) {
	return (state) => {
		const id = crypto.randomUUID?.().toUpperCase() ?? Math.floor(Math.random() * 1e10);

		const newMark = { id, mark: state.elapsed, type: button.type };

		switch (button.type) {
			case EVENT_TYPE.BEGIN: 
			case EVENT_TYPE.END: {
				newMark.datetime = new Date().toISOString();
				break;
			}
			case EVENT_TYPE.PLATE:
			case EVENT_TYPE.PLATE_MA:
			case EVENT_TYPE.PLATE_ME:
			case EVENT_TYPE.PLATE_NH: {
				newMark.plate = '';
				break;
			}
			case EVENT_TYPE.TAG: {
				newMark.tag = '';
				break;
			}
			default: {
				newMark.name = button.name + ' ';
			}
		}

		state.marks.push(newMark);

		if (![EVENT_TYPE.BEGIN, EVENT_TYPE.END].includes(button.type)) {
			setTimeout(() => {
				document.querySelector(`#input_${id}`).focus();
			}, 50);
		}
	}
}