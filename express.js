const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const sseExpress = require('sse-express');
const app = express();

require('express-ws')(app);

app.use(cookieParser());

app.use(bodyParser.json());

app.use((req, res, next) => {
    console.log(req.cookies["useless-random-cookie"])
    if (!req.cookies["useless-random-cookie"]) {
        res.cookie("useless-random-cookie", "Hi_ich_bin_total_nutzlos");
    }
    next();
})

let messages = [];

const addMessage = message => {
    messages.push(message);
    broadcastToWebSockets(['add_message', message]);
    broadcastToSseConnections(message);
    updateHttpRequests();
}

/***********************************************************
 *   XHR:
 ***********************************************************
 */

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
    res.sendStatus(200);
})


/***********************************************************
 *   WebSockets:
 ***********************************************************
 */

let idCount = 0;
let webSockets = [];

const broadcastToWebSockets = message => {
    webSockets.forEach(socket => {
        socket.send(JSON.stringify(message))
    })
}

app.ws('/socket', (ws, req) => {
    webSockets.push(ws);
    ws.on('message', message => {
        addMessage(message)
    })

    ws.on('close', message => {
        webSockets = webSockets.filter(socket => ws.id != socket.id);
    })

    ws.id = idCount++;
    ws.send(JSON.stringify(['init', messages]));
})


/***********************************************************
 *   SSE:
 * **********************************************************
 */

let sseConnections = []

const broadcastToSseConnections = message => {
    sseConnections.filter(res => !res.socket._destroyed)
        .forEach(res => res.sse('add_message', message))
}

app.get('/sse', sseExpress, function (req, res) {
    res.sse('init', messages);
    sseConnections.push(res);
});

/**********************************************************
***********************************************************
 *   Benchmark:
 * **********************************************************
 ***********************************************************/

app.get('/xhrping', function (req, res) {
    res.send("pong");
});


app.ws('/socketping', (ws, req) => {
    ws.on('message', message => {
        ws.send("pong");
    })
})


/**********************************************************/

app.use(express.static('build'));

app.listen(8080, () => console.log('listening on 8080'));