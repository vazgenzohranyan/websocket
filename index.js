let websocket  = require("ws");

let server = new websocket.Server({
    host: "127.0.0.1",
    port: 1000
});

let socket = new websocket("ws://127.0.0.1:1000", () => {
});