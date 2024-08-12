import { updateStorage } from "./updateStorage";

export function handleToggleClick(state, lastTimestamp) {
	state.running = !state.running;    
	updateStorage(state, lastTimestamp, true);
}