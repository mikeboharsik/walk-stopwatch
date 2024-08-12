export function getCoordsFromFile(file) {
	return new Promise((res, rej) => {
		const reader = new FileReader();
		reader.addEventListener('load', async () => {
			const parser = new DOMParser();
			const doc = parser.parseFromString(reader.result, 'text/html');
			const coords = Array.from(doc.querySelectorAll('trkpt'))
				.map(e => {
					const lat = e.attributes['lat'];
					const lon = e.attributes['lon'];
					const ele = e.querySelector('ele');
					const speed = e.querySelector('speed');
					const sat = e.querySelector('sat');
					const time = e.querySelector('time');

					return {
						lat: parseFloat(lat.value),
						lon: parseFloat(lon.value),
						ele: parseFloat(ele.textContent),
						speed: speed ? parseFloat(speed.textContent) : undefined,
						sat: sat ? parseInt(sat.textContent) : undefined,
						time: new Date(time.textContent).getTime(),
					};
				});
			res(coords);
		});
		reader.readAsText(file);
	});
}