const MongoClient = require('mongodb').MongoClient
const dbName = 'myIRC'

class User {
    constructor(socket) {
        this.id = socket.id
    }
    read() {
        console.log('FUNCTIONread')
    }
}

module.exports = User