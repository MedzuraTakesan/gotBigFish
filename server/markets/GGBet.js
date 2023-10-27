const WebSocket = require('ws')
const client = require("socket.io-client");

// let ws = new Socket('https://ws.ggdrop.live/?EIO=3&transport=websocket');

const startGGbet = async () => {
    const socket = client( 'https://ws.ggdrop.live', {
        "auth":{
            "headers":{
                "Authorization":null
            }
        },
        "authEndpoint":"/broadcasting/auth",
        "userAuthentication":{
            "endpoint":"/broadcasting/user-auth",
            "headers":{}
        },
        "broadcaster":"socket.io",
        "csrfToken":null,
        "bearerToken":null,
        "host": "ws.ggdrop.live",
        "key":null,
        "namespace": "App.Events",
        "path":"/socket.io",
        "port": '443',
        "transports":["websocket"],
        "secure":true,
        "enabledTransports":["ws","wss"]
    });

    socket.on('message', (event) => {
        console.log(event)
    })

    socket.on('unexpected-response', (event) => {
        console.log(event)
    })

    socket.on("connect_error", (err) => {
        console.log('connect_error', err)
    });

    socket.open()

    // socket.emit('subscribe', {
    //     channel: 'live_drops',
    //     auth: {
    //         headers: {
    //             Authorization: null
    //         }
    //     }
    // })

    console.log('Сокет запущен')

}



startGGbet()

console.log('Старт программы')
