export function getClockText() {
	const d = new Date();

	const hour = d.getHours().toString().padStart(2, '0');
	const minute = d.getMinutes().toString().padStart(2, '0');
	const second = d.getSeconds().toString().padStart(2, '0');
	const millisecond = d.getMilliseconds().toString().padStart(3, '0');

	return `${hour}:${minute}:${second}.${millisecond}`;
}