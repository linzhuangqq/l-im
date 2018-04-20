import {Application} from './../core/Application.js'
import * as util from 'sav-util'
import * as services from '../services'

export class CommonApplication extends Application {
  constructor ({flux}) {
    super()
    this.flux = flux
  }

  async init (opts) {

  }

  socket () {
    let wsService = new services.WsService(this.flux)
    let wsAddress = 'ws://192.168.100.174:3002/im'
    wsService.ws.setAddress(wsAddress)
    wsService.ws.connect(wsAddress)
    this.flux.prop('websocket', wsService)
  }

  get state () {
    return this.flux.state
  }

  updateState (state) {
    return this.flux.updateState(state)
  }

  ready (fn) {
    if (this.isReady) {
      return fn(this, fn => fn())
    }
    this.once('ready', fn)
  }

  updateOpts (opts) {
    util.extend(this.opts, opts)
  }

  async start () {
    this.flux.prop('util', util)
    this.isReady = true
    await this.emitAsync('ready', this)
  }

  halt (err) {
    console.error('halt', err)
  }
}
