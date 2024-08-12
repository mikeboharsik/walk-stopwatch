export function updateStorage(state, lastTimestamp, ignoreRunning = false) {
	localStorage.setItem('lastTimestamp', lastTimestamp);
	if (state.running || ignoreRunning) {
		localStorage.setItem('state', JSON.stringify(state));
	}
}