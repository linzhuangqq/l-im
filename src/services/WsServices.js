import {Service} from '../core/Service.js'
import {WsModule} from '../modules/WsModule.js'

export class WsService extends Service {
  constructor (opts) {
    super()
    this.ws = new WsModule(opts)
    this.recv()
    this.padding = []
  }

  send (data) {
    if (app.flux.state.userInfo.name && (typeof data === 'object')) {
      data.userName = app.flux.state.userInfo.name
    }
    if (this.ws.connectd()) {
      this.ws.send(JSON.stringify(data))
    } else {
      this.padding.push(data)
    }
  }

  recv () {
    this.ws.on('connected', () => {
      console.log('ws connected')
      if (this.padding.length) {
        this.padding.map((it) => {this.send(it)})
      }
    })

    this.ws.on('error', () => {
      console.log('ws error')
    })

    this.ws.on('disconnected', () => {
      console.log('ws disconnected')
    })

    this.ws.on('recv', (data) => {
      if (data.a === 'recv') {
        if (data.type === 'register') {
          app.flux.dispatch.recvRegister(data)
        }
        if (data.type === 'recvLogin') {
          app.flux.updateState({userInfo: data.userInfo})
        }
        if (data.type === 'refresh') {
          app.flux.updateState({users: data.users, messages: data.messages})
          app.flux.dispatch.refreshCurrentMessages({messages: data.messages, topics: data.topics})
        }
        if (data.type === 'recvMessage') {
          if (!data.status) {
            app.flux.dispatch.error('消息发送失败')
          }
        }
      }
    })
  }
}