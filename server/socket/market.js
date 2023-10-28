const shortCaseUpdateChannel = 'short-update-case'
const fullCaseUpdateChannel = 'full-update-case'
let io = null


const setIo = (ioInit) => {
    io = ioInit
}

const subscribeToUpdate = (socket, channel) => {
    if (!io) {
        return
    }
    socket.join(channel)
}

const unSubscribeToUpdate = (socket, channel) => {
    if (!io) {
        return
    }

    socket.leave(channel)
}

const sendShortUpdate = (market, data) => {
    if (!io) {
        return
    }

    io.to(`${shortCaseUpdateChannel}-${market}`).emit(`${shortCaseUpdateChannel}-${market}`, data)
}

const sendFullUpdate = (market, caseName, data) => {
    if (!io) {
        return
    }

    const channel = `${fullCaseUpdateChannel}-${market}-${caseName}`

    io.to(channel).emit(channel, data)
}



module.exports = {
    fullCaseUpdateChannel,
    shortCaseUpdateChannel,
    setIo,
    subscribeToUpdate,
    unSubscribeToUpdate,
    sendFullUpdate,
    sendShortUpdate
}
