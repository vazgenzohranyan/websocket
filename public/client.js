window.onload = function() {
    let socket = new WebSocket("ws://127.0.0.1:2000");
    let nickname;
    let data;
    socket.onopen = function (req) {
        document.querySelector('#send').onclick = function() {
            socket.send(JSON.stringify({
                id: nickname,
                msg: escape(document.querySelector('#input').value)
            }));
        };
        socket.onmessage = function(msg) {
            data = JSON.parse(msg.data);
            if(data.event === 'id'){
                nickname = data.id;
                _.each(data.messages, (elem) => {
                    let node = document.createElement("LI");
                    let textnode = document.createTextNode(elem);
                    node.appendChild(textnode);
                    document.getElementById("log").appendChild(node);
                    document.querySelector('#input').value = '';
                });
                let node = document.createElement("LI");
                let textnode = document.createTextNode("Your id is " + nickname);
                node.appendChild(textnode);
                document.getElementById("log").appendChild(node);
                document.querySelector('#input').value = '';
            }
            else {
                let node = document.createElement("LI");
                let textnode = document.createTextNode(data.msg);
                node.appendChild(textnode);
                document.getElementById("log").appendChild(node);
                document.querySelector('#input').value = '';
            }

        }

    }
};