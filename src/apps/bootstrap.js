import {CommonApplication} from './CommonApplication.js'

export class Bootstrap extends CommonApplication {
  async init (opts) {
    this.updateOpts(opts)
    this.ready(() => {
      this.socket()
    })
  }
}
