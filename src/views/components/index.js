import Messages from './Messages.vue'
import Topics from './Topics.vue'
import Emotion from './Emotion.vue'
let components = {
  Messages,
  Topics,
  Emotion
}
export function install (Vue) {
  Object.keys(components).forEach((name) => {
    Vue.component(name, components[name])
})
}

Object.defineProperty(components, 'install', {
  value: install,
  enumerable: false,
  configurable: true
})

export default components
