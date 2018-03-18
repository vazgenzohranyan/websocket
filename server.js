let websocket  = require("ws");
let _ = require("underscore");
let express  =require("express");
let bodyparser = require("body-parser");
let http = require("http");
let app = express();
let server = http.createServer(app);
let socketServer = new websocket.Server({
    host: '127.0.0.1',
    port: 2000,
    clientTracking: true
});

let sockets = [];
let messages = [];

app.use(bodyparser());
app.use(express.static(process.cwd() + '/public'));
app.get('/', (req, res) => {
   res.sendFile(process.cwd() + '/public/client.html');
});

app.listen(3000);


socketServer.on('connection', (ws, req) => {
    let date = new Date();
    let id = sockets.length + 1;

    _.each(sockets, (ws) => {
        ws.send(JSON.stringify({
            msg: date + " " + id + " connects to chat"
        }));
    });

    sockets.push(ws);

    ws.send(JSON.stringify({
        event: 'id',
        id: sockets.length,
        messages: messages
    }));

    messages.push(date + " " + id + " connects to chat");

    ws.onmessage = (req) => {
        let data = JSON.parse(req.data);
        let date = new Date();
        messages.push(date + " " + data.msg + ": " + data.id);
        _.each(sockets, (ws) => {
           ws.send(JSON.stringify({
               msg: date + " " + messages[messages.length - 1]
           }));
        });

    };

    ws.onclose = (req) => {
        let skey;
        let date = new Date();
        _.each(sockets, (socket, key) => {
            if(socket === ws) {
                skey = key +1;
                messages.push(date + " " + skey + " disconnects from chat");
                sockets.splice(key,1);
            }
        });
        _.each(sockets, (socket, key) => {
            socket.send(JSON.stringify({
                msg: date + " " + skey + " disconnects from chat"
            }));
        });

    }
});
