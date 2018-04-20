const mongoose = require('./mongodb')

const WebSocketServer = require('ws').Server
const wss = new WebSocketServer({
  port: 3002
})

const userModel = require('./models/user')
const topicsModel = require('./models/topics')
const messageModel = require('./models/message')

module.exports = {
  wss,
  userModel,
  topicsModel,
  messageModel,
  mongoose
}