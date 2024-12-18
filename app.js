const express = require('express');
const server = require('http').createServer();
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');
const createTable = () => {
    db.run(`
        CREATE TABLE visitors (
        count INTEGER, 
        time TEXT
    ) `);

}

const insertData = (data) => {
    db.run('SELECT * FROM visitors;')
}

const getData = () => {
    db.each('SELECT * FROM visitors;', (err, row) => {
        console.log(row);
    })
}

function shutdownDB() {
    getData();
    console.log("shutting down");
    db.close();
}
const app = express();
createTable();

app.get('/', function(req, res) {
res.sendFile('index.html', {root: __dirname});

});

server.on('request', app)


server.listen(3000, function () { console.log("listening on 3000"); });




/** Start WebSockets **/
const WebSocketServer = require('ws').Server;

const wss = new WebSocketServer({ server: server });

process.on('SIGINT', () => {
    wss.clients.forEach(function each(client) {
    client.close();
})
    server.close(() => {
        shutdownDB();
    })
})

wss.on('connection', function (ws) {
    const numClients = wss.clients.size;
    console.log("clients fuckkkk connected:", numClients);
    wss.broadcast(`current visitors: ${numClients}`);

    if (ws.readyState === ws.OPEN) {
        ws.send('Welcome to my server');
    }

    db.run(`INSERT INTO visitors (count, time)
        VALUES(${numClients}, datetime('now'))`);

    ws.on('close', function() {
        const updatedClients = wss.clients.size; // Recalculate the client count
        wss.broadcast(`current visitorss: ${updatedClients}`);
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





