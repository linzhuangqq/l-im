const mongoose = require('mongoose')
const config = require('./config.js')

const db = config.host + ':' + config.port + '/' + config.db
mongoose.connect(db)

mongoose.connection.on('close', function(){
  console.log('正在重新连接数据库')
  mongoose.connect(db)
})

mongoose.connection.on('open', function(){
  console.log('连接成功')
})

mongoose.connection.on('error', function(error){
  console.log('连接失败')
  console.log(error)
  mongoose.disconnect()
})

module.exports = mongoose