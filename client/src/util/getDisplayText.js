export function getDisplayText(timestamp, withoutMillseconds = false) {
	if (timestamp === undefined) {
		return '';
	}

	const hours = (Math.floor(timestamp / (1000 * 60 * 60))).toString().padStart(2, '0');
	const minutes = (Math.floor(timestamp / (1000 * 60)) % 60).toString().padStart(2, '0');
	const seconds = (Math.floor(timestamp / 1000) % 60).toString().padStart(2, '0');
	const milliseconds = (Math.floor(timestamp % 1000)).toString().padStart(3, '0');
	
	return withoutMillseconds ? `${hours}:${minutes}:${seconds}` : `${hours}:${minutes}:${seconds}.${milliseconds}`;
}