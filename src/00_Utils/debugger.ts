import colors from 'colors';

export enum LogTag {
	DEBUG = 'DEBUG',
	ERROR = 'ERROR',
	TEST = 'TEST',
	NOWAY = 'NOWAY',
}

enum LogColor {
	DEBUG = 'green',
	ERROR = 'red',
	TEST = 'yellow',
	NOWAY = 'rainbow',
}

export class Debug {
	public static log(...args: any[]) {
		let tag = args[0];
		let tagForPrint: string = '';
		if (LogTag[args[0]] === undefined) {
			tag = LogTag.DEBUG;
		} else {
			args.shift();
		}
		tagForPrint = colors[LogColor[tag]](tag);

		console.log(
			colors.gray(
				new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
			),
			tagForPrint,
			...args
		);
	}
}
