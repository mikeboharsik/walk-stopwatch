export function getItemStyle(state, mark, idx) {
	if (idx === 0) {
		const diff = Math.floor(state.elapsed - mark.mark);
		if (diff >= 5000) return null;

		const percent = (5000 - diff) / 5000;
		const n = Math.floor(255 - (255 * percent));

		return `color: rgb(255, ${n}, ${n})`;
	}
	return null;
}