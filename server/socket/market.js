const shortCaseUpdateChannel = 'short-update-case'
const fullCaseUpdateChannel = 'full-update-case'
const favoriteCaseUpdateChannel = 'favorite-update-case'
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

const sendFavoriteUpdate = (market, caseName, data) => {
    if (!io) {
        return
    }

    const channel = `${favoriteCaseUpdateChannel}-${market}-${caseName}`

    io.to(channel).emit(channel, {
        favoriteName: `${market}-${caseName}`,
        ...data
    })
}



module.exports = {
    fullCaseUpdateChannel,
    favoriteCaseUpdateChannel,
    shortCaseUpdateChannel,
    setIo,
    subscribeToUpdate,
    unSubscribeToUpdate,
    sendFavoriteUpdate,
    sendFullUpdate,
    sendShortUpdate
}
