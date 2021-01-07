require('app-module-path').addPath(__dirname);
require('source-map-support').install();

import { Debug, LogTag } from '00_Utils/debugger';

Debug.log(LogTag.NOWAY, 'Hello, World!');
