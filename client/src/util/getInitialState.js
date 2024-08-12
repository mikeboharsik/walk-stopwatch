export function getInitialState() {
	const init = localStorage.getItem('state');
	if (init) {
		return JSON.parse(init);
	}

	return {
		running: false,
		marks: [],
		elapsed: 0
	};
}