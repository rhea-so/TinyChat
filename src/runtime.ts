import Express from 'express';
import SocketIO from 'socket.io';
import http from 'http';
import colors from 'colors';
import fs from 'fs';
import bodyParser from 'body-parser';
import morgan from 'morgan';

class Runtime {
	private static commandOptions: any;
	private static server;
	private static express: Express.Express;
	private static socketIO;
	private static socketIOEvents: { connect: (socket: SocketIO.Socket) => Promise<void>, disconnect: (socket: SocketIO.Socket) => Promise<void>, events: any };

	public static async boot() {
		try {
			console.log(colors.green('=== Runtime ==='));
			Runtime.loadCommandOptions();
			Runtime.checkCommandOptions();
			Runtime.loadEnvironment();
			Runtime.createExpress();
			Runtime.createHTTPServer();
			Runtime.createSocketIO();
		} catch (err) {
			Runtime.kill(err.message);
		}
	}

	private static loadCommandOptions(): void {
		const commandLineArgs = require('command-line-args');
		Runtime.commandOptions = commandLineArgs([
			{ name: 'env', alias: 'e', type: String }
		]);
	}

	private static checkCommandOptions(): void {
		if (!!Runtime.commandOptions === false) {
			Runtime.kill('ERROR: 명령줄 인자를 들고오지 못함');
		}

		if (!!Runtime.commandOptions.env === false) {
			Runtime.kill('ERROR: --env 인자가 누락됨');
		}

		if (fs.existsSync(process.cwd() + '/config/' + Runtime.commandOptions.env + '.env') === false) {
			Runtime.kill('ERROR: 존재하지 않는 env를 불러오려 시도함');
		}
	}

	private static loadEnvironment(): void {
		require('dotenv').config({ path: process.cwd() + '/config/' + Runtime.commandOptions.env + '.env' });
	}

	public static kill(message: string): void {
		console.log(colors.red(message));
		process.exit(0);
	}

	private static createHTTPServer(): void {
		Runtime.server = http.createServer(Runtime.express);
		console.log('[HTTP] created');
	}

	private static createExpress(): void {
		Runtime.express = Express();
		Runtime.addMiddleware(bodyParser.urlencoded({ extended: false }));
		Runtime.addMiddleware(bodyParser.json());

		if (process.env.DEBUG === 'true') {
			Runtime.addMiddleware(morgan('dev'));
		}

		console.log('[Express] created');
	}

	private static createSocketIO(): void {
		Runtime.socketIO = SocketIO.listen(Runtime.server, { perMessageDeflate: false, pingInterval: 25000, pingTimeout: 60000 });
		Runtime.socketIOEvents = {
			connect: async () => { },
			disconnect: async () => { },
			events: {}
		};
		Runtime.socketIO.on('connection', (socket) => {
			Runtime.socketIOEvents.connect(socket);

			for (let eventName in Runtime.socketIOEvents.events) {
				socket.on(eventName, (data) => {
					Runtime.socketIOEvents.events[eventName](socket, data);
				});
			}

			socket.on('disconnect', () => {
				Runtime.socketIOEvents.disconnect(socket);
			});
		});
		console.log('[SocketIO] created');
	}

	public static async open(): Promise<void> {
		return new Promise((resolve, _reject) => {
			Runtime.server.listen(Number(process.env.PORT), () => {
				console.log('[HTTP] service is open on', process.env.PORT);
				console.log('');
				resolve();
			});
		});
	}

	/** Express Feature */
	public static get(address: string, func: (req: Express.Request, res: Express.Response) => Promise<void>): void {
		Runtime.express.get(address, func);
	}

	public static post(address: string, func: (req: Express.Request, res: Express.Response) => Promise<void>): void {
		Runtime.express.post(address, func);
	}

	public static addMiddleware(middleware: Express.RequestHandler): void {
		Runtime.express.use(middleware);
	}

	public static createRouter(): Express.Router {
		return Express.Router();
	}

	public static setRouter(address: string, router: Express.Router) {
		Runtime.express.use(address, router);
	}

	/** WebSocket Feature */
	public static connect(callback: (socket: SocketIO.Socket) => Promise<void>): void {
		Runtime.socketIOEvents.connect = callback;
	}

	public static disconnect(callback: (socket: SocketIO.Socket) => Promise<void>): void {
		Runtime.socketIOEvents.disconnect = callback;
	}

	public static receive(eventName: string, callback: (socket: SocketIO.Socket, data: any) => Promise<void>): void {
		Runtime.socketIOEvents.events[eventName] = callback;
	}
}

export = Runtime;
