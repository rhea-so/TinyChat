require('app-module-path').addPath(__dirname);
require('source-map-support').install();

import { Debug, LogTag } from '00_Utils/debugger';

Debug.log(LogTag.NOWAY, 'Hello, World!');

import Runtime from './runtime';

async function main() {
	let sockets: any[] = [];

	await Runtime.boot();

	await Runtime.get('/', async (req, res) => {
		res.json({ message: 'success' });
	});

	await Runtime.connect(async (socket) => {
		Debug.log(socket.id, 'connected');
		sockets.push(socket);
	});

	await Runtime.disconnect(async (socket) => {
		Debug.log(socket.id, 'disconnected');
		const index = sockets.indexOf(socket.id);
		if (index !== -1) {
			sockets[index] = null;
			sockets = sockets.splice(index, 1);
		}
	});

	await Runtime.receive('chat', async (_socket, data) => {
		for (const socket of sockets) {
			socket?.emit('chat', {
				text: data.text,
				version: 1
			});
		}
	});

	await Runtime.open();
}

main().then().catch(err => Debug.log(LogTag.ERROR, err));
