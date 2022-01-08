db.createCollection("users", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["pseudo", "email", "password", "admin", "rooms", "connected"],
            properties: {
                pseudo: {
                    bsonType: "string"
                },
                email: {
                    bsonType: "string"
                },
                password: {
                    bsonType: "string"
                },
                admin: {
                    bsonType: "bool"
                },
                rooms: {
                    bsonType: "array"
                },
                connected: {
                    bsonType: "bool"
                },
                lastConnection: {
                    bsonType: "date"
                }
            }
        }
    }
})

db.createCollection("rooms", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["name", "IDmembers", "IDadmin"],
            properties: {
                name: {
                    bsonType: "string"
                },
                IDmembers: {
                    bsonType: "array"
                },
                IDadmin: {
                    bsonType: "int"
                }
            }
        }
    }
})

db.createCollection("privateRooms", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["IDmembers"],
            properties: {
                IDmembers: {
                    bsonType: "array"
                }
            }
        }
    }
})

db.createCollection("messages", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["message", "IDorigin", "IDroom", "private", "date"],
            properties: {
                message: {
                    bsonType: "string"
                },
                IDorigin: {
                    bsonType: "int"
                },
                IDroom: {
                    bsonType: "int"   
                },
                private: {
                    bsonType: "bool"
                },
                date: {
                    bsonType: "date"
                }
            }
        }
    }
})

db.users.createIndex({"email": 1}, {unique: true})