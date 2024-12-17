const express = require('express');
const server = require('http').createServer();

const app = express();

app.get('/', function(req, res) {
res.sendFile('index.html', {root: __dirname});

});

server.on('request', app)


server.listen(3000, function () { console.log("listening on 3000"); });

/** start websocketsconst express = require('express');
const server = require('http').createServer();

const app = express();

app.get('/', function(req, res) {
    res.sendFile('index.html', { root: __dirname });
});

server.on('request', app);

server.listen(3000, function () {
    console.log("listening on 3000");
});

/** Start WebSockets **/
const WebSocketServer = require('ws').Server;

const wss = new WebSocketServer({ server: server });

wss.on('connection', function (ws) {
    const numClients = wss.clients.size;
    console.log("clients connected:", numClients);
    wss.broadcast(`current visitors: ${numClients}`);

    if (ws.readyState === ws.OPEN) {
        ws.send('Welcome to my server');
    }

    ws.on('close', function() {
        const updatedClients = wss.clients.size; // Recalculate the client count
        wss.broadcast(`current visitors: ${updatedClients}`);
        console.log("a client has disconnected");
    });
});

// Broadcast function
wss.broadcast = function broadcast(data) {
    wss.clients.forEach(function each(client) {
        if (client.readyState === client.OPEN) { // Only send to open connections
            client.send(data);
        }
    });
};

