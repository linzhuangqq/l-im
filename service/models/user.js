const mongoose = require('./../mongodb')
const Schema = mongoose.Schema
const UserSchema = new Schema({
    name: {
    type: String,
    required: [true, '必须填写用户名'],
    allowNull: false,
    trim: true
  }
})
module.exports = mongoose.model('User', UserSchema)