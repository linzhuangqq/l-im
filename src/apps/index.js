import {Vue, Flux, FluxVue} from '../views/VueFlux.js'
import App from '../views/index.vue'
import {Bootstrap} from './bootstrap.js'

import {state, actions, mutations} from '../store'
let flux = new Flux({
  noProxy: true,
  strict: true
})

flux.declare({
  state: state,
  mutations: mutations,
  actions: actions
})

let app = new Bootstrap({
  flux
})

app.bootstrap({}).then(() => {

})
app.ready(() => {
  let vm = new Vue({
    ...App,
    vaf: new FluxVue({flux})
  })
  vm.$mount('#app')
  app.vm = vm
})

export default app
