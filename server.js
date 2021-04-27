'use strict';
const express = require('express');
const ws = require('ws');
const path = require('path');

// Constants
const PORT = 3000;
const HOST = '0.0.0.0';

// WebSocket server with dumb echo service
const wss = new ws.Server({ noServer: true });
wss.on('connection', socket => {
    socket.on('message', function(message) {
        const result = 'Received "' + message + '"';
        console.log(result);
        // Now echo the message back
        socket.send(result);
    });
    socket.on('close', function(reasonCode, description) {
        console.log('Client connection closed.');
    });
});

// Express app + add websocket upgrade
const app = express();
app.use('/', express.static(path.join(__dirname, 'static')));
const server = app.listen(PORT, HOST);
server.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, socket => {
      wss.emit('connection', socket, request);
    });
  });

console.log(`Running on http://${HOST}:${PORT}`);
