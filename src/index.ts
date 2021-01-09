require('app-module-path').addPath(__dirname);
require('source-map-support').install();

import { Debug, LogTag } from '00_Utils/debugger';

Debug.log(LogTag.NOWAY, 'Hello, World!');

import Runtime from './runtime';
import path from 'path';
import express from 'express';

let serviceDown: boolean = false;

async function main() {
	let sockets: any[] = [];

	await Runtime.boot();

	Runtime.addMiddleware((_req, res, next) => {
		res.setHeader('Connection', 'close');
		next();
	})

	Runtime.get('/', async (_req, res) => {
		res.json({ message: 'success' });
	});

	Runtime.get('/health', async (_req, res) => {
		if (serviceDown === true) {
			res.status(500).end();
			return;
		}
		res.json({ message: 'success' });
	});

	Runtime.addMiddleware(express.static(path.join(__dirname, '..', '/public')));

	Runtime.connect(async (socket) => {
		Debug.log(socket.id, 'connected');
		sockets.push(socket);
	});

	Runtime.disconnect(async (socket) => {
		Debug.log(socket.id, 'disconnected');
		const index = sockets.indexOf(socket.id);
		if (index !== -1) {
			sockets[index] = null;
			sockets = sockets.splice(index, 1);
		}
	});

	Runtime.receive('chat', async (_socket, data) => {
		for (const socket of sockets) {
			socket?.emit('chat', {
				nickname: data.nickname,
				message: data.message,
				version: 1
			});
		}
	});

	await Runtime.open();
}

main().then().catch(err => Debug.log(LogTag.ERROR, err));

function startGracefulShutdown() {
	serviceDown = true;
	setTimeout(() => {
		process.exit(0);
	}, 1000 * 5);
}

process.on('SIGTERM', startGracefulShutdown);
process.on('SIGINT', startGracefulShutdown);