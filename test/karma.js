/* eslint-env node */

'use strict';

var Server = require('karma').Server;
var options = JSON.parse(process.argv[2]);

new Server.start(options);
