const app = require('express')()
const server = require('http').createServer(app)
const io = require("socket.io")(server)
const cors = require("cors");
const port = process.env.PORT || 3333;
const User = require('./classUser')

app.use(cors())

app.get('/', (req, res) => {
    res.send('ON WORK')
})

server.listen(port, () => {
    console.log('en attente');
});

io.on('connection', (socket) => {
    console.log('a new user has arrived')
    newUser = new User(socket)
    io.to(socket.id).emit('loggedIn', newUser)
    // io.on('login', (infosLogIn) => {
        // Traitement des infos
        // valider la connection
        // new User
        // emit User
    // }) 

    socket.on('test', (user) => {
        console.log(user)
        // user.read()
    })
})