const { Server } = require("socket.io");
const market = require('./market')

const subscribeToChannel = (socket, channel) => {
    if (channel.indexOf(market.shortCaseUpdateChannel) > -1) {
        market.subscribeToUpdate(socket, channel)
        return
    }
    if (channel.indexOf(market.fullCaseUpdateChannel) > -1) {
        market.subscribeToUpdate(socket, channel)
        return
    }
}

const unSubscribeToChannel = (socket, channel) => {
    if (channel.indexOf(market.shortCaseUpdateChannel) > -1) {
        market.unSubscribeToUpdate(socket, channel)
        return
    }
    if (channel.indexOf(market.fullCaseUpdateChannel) > -1) {
        market.unSubscribeToUpdate(socket, channel)
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
    sendShortUpdate: market.sendShortUpdate,
    sendFullUpdate: market.sendFullUpdate
}
