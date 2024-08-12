import { getCoordsFromFile } from './getCoordsFromFile';
import { getExportContent } from './getExportContent';

export async function handleUploadClick(fileInputChangeEvent, state, uploadHost, onStart, onEnd, onError, onFinally, isTestUpload) {
	const [file] = fileInputChangeEvent.target.files;

	const coords = await getCoordsFromFile(file);

	const exportContent = await getExportContent(state, coords);
	if (isTestUpload) {
		console.log(JSON.stringify(exportContent, null, '  '));
	} else {
		try {
			onStart?.();
			await fetch(`${uploadHost}/events`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(exportContent) });
			onEnd?.();
		} catch (e) {
			onError?.();
			console.log(e);
		} finally {
			onFinally?.();
			fileInputChangeEvent.target.value = null;
		}
	}
}