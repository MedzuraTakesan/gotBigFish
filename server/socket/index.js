const { Server } = require("socket.io");
const market = require('./market')

const subscribeToChannel = (socket, channel) => {
    if (channel.indexOf(market.shortCaseUpdateChannel) > -1) {
        market.subscribeToShortUpdate(socket, channel)
        return
    }
}

const unSubscribeToChannel = (socket, channel) => {
    if (channel.indexOf(market.shortCaseUpdateChannel) > -1) {
        market.unSubscribeToShortUpdate(socket, channel)
        return
    }
}

const init = (server) => {
    const io = new Server(server);

    market.setIo(io)

    io.on('connection', (socket) => {
        socket.on('subscribe', (msg) => {
            if (!msg?.channel) {
                return
            }

            subscribeToChannel(socket, msg.channel)
        })
        socket.on('unsubscribe', (msg) => {
            if (!msg?.channel) {
                return
            }

            unSubscribeToChannel(socket, msg.channel)
        })
    });
}


module.exports = {
    init,
    sendShortUpdate: market.sendShortUpdate
}
