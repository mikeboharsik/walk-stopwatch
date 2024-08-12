export function getItemDeleteHandler(id) {
	return (state) => {
		const targetIdx = state.marks.findIndex(e => e.id === id);
		state.marks.splice(targetIdx, 1);
	}
}