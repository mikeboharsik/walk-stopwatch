import { updateStorage } from './updateStorage';

function resetStorage(state, lastTimestamp) {
	state.marks = [];
	state.elapsed = 0;
	state.running = false;
	updateStorage(state, lastTimestamp, true);
}

function backup(state) {
	const maxBackupCount = 5;
	for (let i = maxBackupCount - 1; i >= 0; i--) {
		localStorage.setItem(`Backup_${i}`, localStorage.getItem(`Backup_${i-1}`));
	}
	localStorage.setItem('Backup_0', JSON.stringify(state));
}

export function handleResetClick(state, lastTimestamp) {
	backup(state);
	resetStorage(state, lastTimestamp);
}