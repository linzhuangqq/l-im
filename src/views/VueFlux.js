// 全局的VUE组件需要在这里注册
// 其他需要用Vue的需要从这里引入

import Vue from 'vue'
import {Flux, FluxVue} from 'sav-flux'

import components from './components/'

Vue.use(FluxVue)
Vue.use(components)

export {Vue}
export {Flux}
export {FluxVue}
