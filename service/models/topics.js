const mongoose = require('./../mongodb')
const Schema = mongoose.Schema
const TopicSchema = new Schema({
  id: {
    type: Number,
    required: true,
    trim: true
  },
  members: {
    type: Array,
    required: true
  }
})
module.exports = mongoose.model('Topics', TopicSchema)