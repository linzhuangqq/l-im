const mongoose = require('./../mongodb')
const Schema = mongoose.Schema
const MessageSchema = new Schema({
  id: {
    type: Number,
    required: true,
    trim: true
  },
  content: {
    type: String
  },
  tm: {
    type: Number
  },
  send: {
    type: String
  },
  t: {
    type: String
  }
})
module.exports = mongoose.model('Messages', MessageSchema)