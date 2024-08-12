import { getCoordsFromFile } from './getCoordsFromFile';
import { getExportContent } from './getExportContent';

export async function handleDownloadClick(fileInputChangeEvent, state) {
	const [file] = fileInputChangeEvent.target.files;

	const coords = await getCoordsFromFile(file);

	const exportContent = await getExportContent(state, coords);
	
	const blob = new Blob([JSON.stringify(exportContent)], { type: "application/json" });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = `${exportContent.date}_walk.json`;
	a.click();
	URL.revokeObjectURL(url);
}