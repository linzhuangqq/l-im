
/**
 * 核心服务类
 *
 */
export class Service {
  constructor (app, opts) {
    this.app = app
    this.opts = opts || {}
    if (this.initService) {
      this.initService(app, opts)
    }
  }

  get state () {
    return this.flux.state
  }
  updateState (state) {
    return this.flux.updateState(state)
  }
  bindRecv (type, method) {
    if (typeof method === 'string') {
      method = this[method].bind(this)
    }
    this.app.driver.on(type, method)
  }
}
