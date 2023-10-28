const shortCaseUpdateChannel = 'short-update-case'
let io = null


const setIo = (ioInit) => {
    io = ioInit
}

const subscribeToShortUpdate = (socket, channel) => {
    if (!io) {
        return
    }
    socket.join(channel)
}

const unSubscribeToShortUpdate = (socket, channel) => {
    if (!io) {
        return
    }

    socket.leave(channel)
}

const sendShortUpdate = (market, data) => {
    if (!io) {
        return
    }

    // if (market === 'case-battle.io') {
    //     console.log(`${shortCaseUpdateChannel}-${market}-${caseName}`)
    // }

    io.to(`${shortCaseUpdateChannel}-${market}`).emit(`${shortCaseUpdateChannel}-${market}`, data)
}



module.exports = {
    shortCaseUpdateChannel,
    setIo,
    subscribeToShortUpdate,
    unSubscribeToShortUpdate,
    sendShortUpdate
}
