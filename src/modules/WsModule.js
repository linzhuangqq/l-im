import {AbstractSourceModule, ERR_STRINGIFY, ERR_CONNECTFAIL} from './AbstractSourceModule.js'

let Socket = window.WebSocket || window.MozWebSocket

/**
 * WebSocket 功能模块, 业务无关
 */
export class WsModule extends AbstractSourceModule {
  constructor () {
    super()
    this.checkerHandle = 0
    this.lastPongTime = 0
    this.stringify = true
  }
  /**
   * 打开连接
   * @param  {String} address wss://地址
   * @return {Promsie}
   */
  connect (address) {
    this.lastPongTime = 0
    this.connected = false
    if (!this.checkerHandle) {
      this.checkerHandle = setInterval(checkConnection.bind(this), 3000)
    }
    return new Promise((resolve, reject) => {
      this.address = address
      let notCalled = true
      let conn = this.conn = new Socket(address)
      conn.onopen = (event) => {
        if (notCalled) {
          notCalled = false
          resolve()
        }
        if (this.conn !== conn) {
          return
        }
        this.connected = true
        this.emit('connected')
      }
      conn.onclose = (event) => {
        if (this.conn !== conn) {
          return
        }
        this.connected = false
        this.conn = null
        this.emit('disconnected', {
          code: event.code
        })
      }
      conn.onerror = (event) => {
        if (notCalled) {
          notCalled = false
          reject(event)
        }
        if (this.conn !== conn) {
          return
        }
        this.connected = false
        this.conn = null
        conn.close()
        this.emit('error', {type: ERR_CONNECTFAIL, event})
      }
      conn.onmessage = dispatchMessage.bind(this)
    })
  }
  /**
   * 断开连接
   */
  disconnect () {
    if (this.checkerHandle) {
      clearInterval(this.checkerHandle)
      this.checkerHandle = null
    }
    let {conn} = this
    if (conn) {
      conn.close()
      this.conn = conn.onopen = conn.onclose = conn.onerror = conn.onmessage = null
    }
    this.lastPongTime = 0
    this.connected = false
//    this.address = ''
  }

  setAddress (address) {
    this.address = address
  }

  send (data) {
    this.conn.send(data)
  }

  connectd () {
    return this.conn.readyState === this.conn.OPEN
  }
}

function checkConnection () {
  if (!this.conn) {
    return this.connect(this.address)
  }
  let {conn} = this
  if (conn.readyState === conn.OPEN) {
    let time = +new Date()
    if (time - this.lastPongTime > 10000 && this.lastPongTime !== 0) {
      this.disconnect()
      return this.connect(this.address)
    } else if (time - this.lastPongTime < 5000 || this.lastPongTime === 0) {
      this.conn.send('PING')
    }
  } else if (conn.readyState === conn.CLOSED) {
    this.disconnect()
    return this.connect(this.address)
  }
}

function dispatchMessage (event) {
  let data = event.data
  this.lastPongTime = +new Date()
  if (data === 'PONG') {
    return
  }
  if (data.charAt(0) === '{') {
    let obj
    try {
      obj = JSON.parse(data)
    } catch (err) {
      this.emit('error', {type: ERR_STRINGIFY, data})
      return
    }
    this.emit('recv', obj)
  }
}
