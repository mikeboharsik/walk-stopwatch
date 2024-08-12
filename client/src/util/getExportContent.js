import { EVENT_TYPE } from './markButtons';
import { getDisplayText } from './getDisplayText';

export async function getExportContent(state, coords) {
	const copy = JSON.parse(JSON.stringify(state.marks));

	const beginEvent = copy.find(m => m.type === EVENT_TYPE.BEGIN);
	const endEvent = copy.find(m => m.type === EVENT_TYPE.END);

	const startMark = getDisplayText(beginEvent?.mark);
	const endMark = getDisplayText(endEvent?.mark);

	const startTime = beginEvent?.datetime;
	const endTime = endEvent?.datetime;

	copy.forEach((m) => {
		m.mark = getDisplayText(m.mark);
		if (m.name) {
			m.name = m.name.trim();
		}

		switch(m.type) {
			case EVENT_TYPE.BEGIN:
			case EVENT_TYPE.END:
			case EVENT_TYPE.PLATE:
			case EVENT_TYPE.TAG: {
				break;
			}
			case EVENT_TYPE.PLATE_MA: {
				m.plate = `MA ${m.plate}`;
				break;
			}
			case EVENT_TYPE.PLATE_ME: {
				m.plate = `ME ${m.plate}`;
				break;
			}
			case EVENT_TYPE.PLATE_NH: {
				m.plate = `NH ${m.plate}`;
				break;
			}
			case EVENT_TYPE.MISC: {
				break;
			}
			default: {
				m.plate = '';
			}
		}

		delete m.id;
	});
	const events = copy.filter(e => ![EVENT_TYPE.BEGIN, EVENT_TYPE.END].includes(e.type));

	events.forEach(m => { 
		delete m.type;

		Object.keys(m).forEach(key => {
			m[key] = m[key].trim();
		});
	});

	return {
		date: beginEvent?.datetime?.slice(0, 10),
		startMark,
		endMark,
		startTime,
		endTime,
		events,
		coords,
	};
}