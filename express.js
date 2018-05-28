const express = require("express");
var bodyParser = require('body-parser');
const app = express();

require('express-ws')(app);

let messages = [];

app.use(bodyParser.json());

app.use((req, res, next) => {
    //console.log(req);
    next();
})

let httpConnections = []

const updateHttpRequests = () => {
    httpConnections.splice(0, httpConnections.length)
        .forEach(
            res => res.send(
                JSON.stringify(
                    [...messages].splice(res.length, messages.length)
                )
            )
        )
}

app.get("/messages", (req, res, next) => {
    res.setHeader('Content-Type', 'application/json');

    const length = parseInt(req.query.q);
    if (length < messages.length) {
        res.send(
            JSON.stringify(
                [...messages].splice(length, messages.length)
            )
        );
        return;
    } else {
        res.length = length;
        httpConnections.push(res);
    }
})

app.post("/post", (req, res, next) => {
    addMessage(req.body.text);
    res.send(200);
})


const addMessage = message => {
    messages.push(message);
    broadcastToSockets(['add_message', message]);
    updateHttpRequests();
}


let idCount = 0;
let sockets = [];

const broadcastToSockets = message => {
    sockets.forEach(socket => {
        socket.send(JSON.stringify(message))
    })
}

app.ws('/socket', (ws, req) => {
    sockets.push(ws);

    ws.on('message', message => {
        addMessage(message)
    })

    ws.on('close', message => {
        sockets = sockets.filter(socket => ws.id != socket.id);
    })

    ws.id = idCount++;
    ws.send(JSON.stringify(['init', messages]));
})

app.use(express.static('build'));

app.listen(8080, () => console.log('listening on 8080'));