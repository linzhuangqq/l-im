/*
  流程
  应用程序->初始化(编排组件)->启动(开启功能)
 */
import {extend} from 'sav-util'
import {AsyncEvent} from './AsyncEvent.js'

/**
 * 应用程序入口接口
 * 子应用应该从这个继承
 */
export class Application extends AsyncEvent {
  constructor () {
    super()
    this.opts = {}
  }
  /**
   * 启动应用
   * @param  {Object} opts 启动参数
   */
  async bootstrap (opts) {
    return this.init(opts).then(this.start.bind(this)).catch(this.halt.bind(this))
  }
  /**
   * 初始化应用
   *
   * 重要的是有了配置
   *
   * @param  {Object} opts 配置信息
   * @return {Promsie}
   */
  async init (opts) {
    extend(this.opts, opts)
  }
  /**
   * 启动应用
   *
   * 初始化成功后即可启动应用
   * 可以在init和start的间隙做点其他的事情
   * 但是不能保证应用的所有组件都能正常工作
   *
   * @return {Promise}
   */
  async start () {
    await this.emitAsync('ready', this) // 触发开始信号, 各干个的吧
  }
  /**
   * 应用挂起
   * @param  {Error} e 异常信息
   */
  halt (e) {}
}
