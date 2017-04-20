#!/usr/bin/env node
/* eslint no-console:0 */

const cluster = require('cluster');

require('babel-register');

if (cluster.isMaster && process.env.NODE_ENV !== 'development') {
  cluster.fork();

  cluster.on('exit', (deadWorker) => {
    const worker = cluster.fork();

    console.log(`worker ${deadWorker.process.pid} died`);
    console.log(`worker ${worker.process.pid} born`);
  });
} else {
  require('nodejs-dashboard');
  require('./server');
}
