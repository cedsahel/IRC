var readline = require('readline')
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
})

const io = require('socket.io-client')
const socket = io.connect('ws://localhost:3333')

socket.on('msg', (msg) => {
    console.log(msg)
})

rl.on('line', (line) => {
    socket.emit('msgduclient', line)
})

