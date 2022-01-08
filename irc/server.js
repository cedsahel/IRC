const app = require('express')()
const server = require('http').createServer(app)
const io = require("socket.io")(server)

let allUsers = {};
let allTimeout = {};
let createdRoom = {};

io.on('connection', (socket) => {

    console.log('a user connected');

    socket.nickname = socket.id
    socket.join('global')
    allUsers[socket.nickname] = socket.id

    socket.on('disconnect', () => {
        console.log('user disconnected');
        delete allUsers[socket.nickname]
    });

    socket.on('msgduclient', (msg) => {
        let splitMsg = msg.split(' ')
        let command = splitMsg.splice(0, 1).join('')
        switch (command) {
            case '/nick':
                var newNick = splitMsg.join(' ')
                if (newNick === undefined || newNick.trim() === '') {
                    io.to(socket.id).emit('msg', `! Précisez votre nouveau pseudo !`)
                } else {
                    io.to(socket.id).emit('msg', `Votre nouveau pseudo est '${newNick}'`)
                    changeNickname(socket, newNick)
                }
                break
            case '/create':
                var newRoom = splitMsg.join(' ')
                if (newRoom === undefined || newRoom.trim() === '') {
                    io.to(socket.id).emit('msg', `! Précisez le nom de la salle !`)
                } else if (io.sockets.adapter.rooms.get(newRoom) !== undefined) {
                    io.to(socket.id).emit('msg', `! La salle ${newRoom} existe déjà !`)
                } else {
                    io.to(socket.id).emit('msg', `Vous avez créé la salle '${newRoom}'`)
                    createRoom(socket, newRoom)
                }
                break
            case '/join':
                var roomToJoin = splitMsg.join(' ')
                if (roomToJoin === undefined || roomToJoin.trim() === '') {
                    io.to(socket.id).emit('msg', `! Précisez le nom de la salle !`)
                } else if (io.sockets.adapter.rooms.get(roomToJoin) === undefined) {
                    io.to(socket.id).emit('msg', `! Cette salle n'existe pas !`)
                } else if (io.sockets.adapter.sids.get(socket.id).has(roomToJoin)) {
                    io.to(socket.id).emit('msg', `! Vous êtes déjà dans ce salon !`)
                } else {
                    io.to(roomToJoin).emit('msg', `'${socket.nickname}' a rejoint la salle ${roomToJoin}`)
                    io.to(socket.id).emit('msg', `Vous avez rejoint la salle '${roomToJoin}'`)
                    joinRoom(socket, roomToJoin)
                }
                break
            case '/list':
                listRooms(socket)
                break
            case '/private':
                if (splitMsg[1] !== undefined && allUsers[splitMsg[1]] !== undefined && splitMsg[2] !== undefined && splitMsg[2].trim() !== '') {
                    let receiver = allUsers[splitMsg[1]]
                    delete splitMsg[0]
                    delete splitMsg[1]
                    let newMsg = splitMsg.join(' ').trim()
                    io.to(receiver).emit('msg', `Message privé de '${socket.nickname}' : ${newMsg}`)
                } else {
                    io.to(socket.id).emit('msg', `! L'utilisateur n'existe pas !`)
                }
                break
            case '/room': {
                var room = splitMsg.splice(0, 1).join('')
                var message = splitMsg.join(' ')
                if (room === undefined) {
                    io.to(socket.id).emit('msg', `! Spécifiez un salon !`)
                } else if (io.sockets.adapter.rooms.get(room) === undefined) {
                    io.to(socket.id).emit('msg', `! Ce salon n'existe pas !`)
                } else if (!io.sockets.adapter.sids.get(socket.id).has(room)) {
                    io.to(socket.id).emit('msg', `! Vous n'êtes pas dans ce salon !`)
                } else if (message === undefined || message.trim() === '') {
                    io.to(socket.id).emit('msg', `! Spécifiez un message !`)
                } else {
                    roomMessage(socket, room, message)
                }
                break
            }
            case '/users': {
                var room = splitMsg[0] === undefined ? 'global' : splitMsg.join('')
                if (io.sockets.adapter.rooms.get(room) === undefined) {
                    io.to(socket.id).emit('msg', `! Ce salon n'existe pas !`)
                } else if (!io.sockets.adapter.sids.get(socket.id).has(room)) {
                    io.to(socket.id).emit('msg', `! Vous n'êtes pas dans ce salon !`)
                } else {
                    getUsersInRoom(socket, room)
                }
                break
            }
            case "/delete": {
                var room = splitMsg.join(' ')
                if (io.sockets.adapter.rooms.get(room) === undefined) {
                    io.to(socket.id).emit('msg', `! Ce salon n'existe pas !`)
                } else if (createdRoom[room] !== socket.id) {
                    io.to(socket.id).emit('msg', `! Vous n'êtes pas le créateur de ce salon !`)
                } else {
                    io.to(socket.id).emit('msg', `Vous avez supprimé la salle '${room}'`)
                    remove(room)
                }
                break
            }
            case "/leave": {
                var room = splitMsg.join(' ')
                if (io.sockets.adapter.rooms.get(room) === undefined) {
                    io.to(socket.id).emit('msg', `! Ce salon n'existe pas !`)
                    } else if (!io.sockets.adapter.sids.get(socket.id).has(room)) {
                        io.to(socket.id).emit('msg', `! Vous n'êtes pas dans ce salon !`)
                    /* } else if (user admin de room) {
                        io.to(socket.id).emit('msg', `! Vous ne pouvez pas quitter un salon dont vous êtes l'admin !`) */
                } else {
                    io.to(socket.id).emit('msg', `Vous avez quitté la salle '${room}'`)
                    leaveRoom(socket, room)
                }
                break
            }
            default:
                if (msg.trim().length === 0) {
                    io.to(socket.id).emit('msg', `! Spécifiez un message !`)
                } else {
                    roomMessage(socket, 'global', msg)
                }
        }
    })
});



server.listen(3333, () => {
    console.log('en attente');
});

function remove(room) {
    io.in(room).socketsLeave(room)
}

function changeNickname(socket, newNickname) {
    socket.broadcast.emit('msg', `'${socket.nickname}' change de pseudo et devient '${newNickname}'`)
    delete allUsers[socket.nickname]
    allUsers[newNickname] = socket.id
    socket.nickname = newNickname
}

function createRoom(socket, newRoom) {
    newRoom = newRoom.trim()
    socket.join(newRoom);
    socket.broadcast.emit('msg', `'${socket.nickname}' crée la salle '${newRoom}'`)
    createdRoom[newRoom] = socket.id
    allTimeout[newRoom] = setTimeout(remove, 200000, newRoom)
}

function joinRoom(socket, roomToJoin) {
    socket.join(roomToJoin);
}

function listRooms(socket) {
    let rooms = io.sockets.adapter.rooms
    let transitString = Array.from(rooms)
    transitString.forEach(element => {
        if (!Object.values(allUsers).includes(element[0])) {
            io.to(socket.id).emit('msg', `--> ${element[0]}`)
        }
    });
}

function roomMessage(socket, room, message) {
    socket.to(room).emit('msg', `${socket.nickname} dans le salon ${room} => ${message}`);
    clearTimeout(allTimeout[room])
    allTimeout[room] = setTimeout(remove, 200000, room)
}

function getUsersInRoom(socket, room) {
    let arrayUser = Array.from(io.sockets.adapter.rooms.get(room))
    io.to(socket.id).emit('msg', `Les utilisateurs du salon '${room}' sont :`)
    arrayUser.forEach(element => {
        for (const [key, value] of Object.entries(allUsers)) {
            if (value === element) {
                io.to(socket.id).emit('msg', `--> ${key}`)
                break
            }
        }
    });
}

function leaveRoom(socket, room) {
    socket.leave(room)
}

// permet de savoir les rooms des utilisateur
// console.log(io.sockets.adapter.sids);