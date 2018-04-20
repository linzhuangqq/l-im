import {AsyncEvent} from './AsyncEvent.js'

export const ERR_STRINGIFY = 'ERR_STRINGIFY'     // 序列化失败
export const ERR_NOCONNECTED = 'ERR_NOCONNECTED' // 尚未建立连接
export const ERR_CONNECTFAIL = 'ERR_CONNECTFAIL' // 连接失败

/**
 * 错误类型
 */
export const ErrorTypes = {
  ERR_STRINGIFY,
  ERR_NOCONNECTED,
  ERR_CONNECTFAIL
}

/**
 * 数据源基类
 */
export class AbstractSourceModule extends AsyncEvent {
  constructor () {
    super()
    this.conn = null
    this.connected = false
    this.address = null
    this.stringify = false
  }
  /**
   * 发送数据
   * @param  {String|Object} text 数据内容
   */
  send (text) {
    if (this.connected) {
      if (this.stringify) {
        if (typeof text !== 'string') {
          try {
            text = JSON.stringify(text)
          } catch (error) {
            this.emit('error', {type: ERR_STRINGIFY, text})
            return
          }
        }
      }
      this.conn.send(text)
    } else {
      this.emit('error', {type: ERR_NOCONNECTED, text})
    }
  }
  /**
   * 是否已经连接上
   */
  get isConnected () {
    return this.connected
  }
}
