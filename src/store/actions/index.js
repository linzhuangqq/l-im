import {genToken} from './../util'
let proxyFn = {}

export function getTopics () {

}

export async function isLogin ({dispatch}) {
  let loginName = localStorage.getItem('loginName')
  if (loginName) {
    dispatch.login({name: loginName})
  } else {
    proxyFn.login()
  }
}

export function register ({websocket}, {name}) {
  websocket.send({a: 'm', type: 'register', name})
}

export function login ({websocket, commit, state: {userInfo}}, {name}) {
  websocket.send({a: 'm', type: 'login', name})
  commit.updateStateUserInfo({name})
  localStorage.setItem('loginName', name)
}

export async function proxy (_, fns) {
  proxyFn = fns
}

export function recvRegister ({dispatch}, {status, name}) {
  if (status) {
    dispatch.login({name}).then(() => {
      proxyFn.loginSuccess()
    })
  } else {
    proxyFn.loginError()
  }
}

export function addFriend ({websocket, resolve}, {name}) {
  websocket.send({a: 'm', type: 'addFriend', name})
  return resolve()
}

export function sendMessage ({websocket, resolve}, {message, topic, t = 'text'}) {
  websocket.send({a: 'm', type: 'message', message, topic, t})
  return resolve()
}

export function refreshCurrentMessages ({commit}, {messages, topics}) {
  commit.refreshCurrentMessages({messages, topics})
}

export function error (_ ,t) {
  proxy.error(t)
}

export function success (_ ,t) {
  proxy.success(t)
}

/*
 * 七牛上传
 * */
export function uploadPicture ({util: {ajax}, state, dispatch}, {file}) { // 七牛
  /* global FormData */
  let AK = 'dFmHAKtbx67xLllMOSae-9eGTPZRqElnsRK5tbIi'
  let SK = 'dYLkrY_UwrMp9i8zZipie-t-LNRNVhdDruUvRcte'
  let putPolicy = {
    scope: 'image',
    deadline: Math.round(new Date().getTime() / 1000) + 3600
  }
  let token = genToken(AK, SK, putPolicy)
  let form = new FormData()
  form.append('token', token)
  form.append('file', file)
  var ajaxOpts = {
    url: 'https://up.qbox.me',
    method: 'POST',
    data: form,
    cache: false,
    contentType: false,
    processData: false,
    forceSync: false
  }
  // 因为xhr不需要的时候，不必传参
  if (typeof progress === 'function') {
    ajaxOpts.xhr = (req) => {
      let xhrobj = req
      let percent = 0
      if (xhrobj.upload) {
        let handler = (event) => {
          let position = event.loaded || event.position
          let total = event.total || event.totalSize
          if (event.lengthComputable) {
            percent = Math.ceil(position / total * 100)
          }
          progress.call(xhrobj, percent, total, position)
        }
        xhrobj.upload.addEventListener('progress', handler, false)
      }
      return xhrobj
    }
  }
  return new Promise((resolve, reject) => {
    ajax(ajaxOpts, function (error, data) {
      return resolve(data)
    })
  })
}

