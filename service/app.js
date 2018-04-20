const {wss, userModel, topicsModel, messageModel} = require('./service')

async function findAllUser(uname) {
  let users = await userModel.find({name: {$nin: [uname]}})
  return users
}


async function Register(data, ws) {
  let success = {a: 'recv', type: 'register', tm: Date.now(), name: data.name, status: true}
  let error =   {a: 'recv', type: 'register', tm: Date.now(), status: false}
  let resultFind = await userModel.find({
    name: data.name
  })

  if(resultFind.length) {
    ws.send(toString(error))
    return
  }

  let result = await userModel.create({
    name: data.name
  })

  if(result) {
    ws.send(toString(success))
  } else {
    ws.send(toString(error))
  }
}

function client () {
  return {
    send: (data) => {
      wss.clients.forEach((client) => {
        client.send(data)
      })
    }
  }
}

async function findAllTopics (name) {
  let topics = await topicsModel.find({})
  topics = topics.filter((it) => {
    if (it.members.indexOf(name) >= 0){
      return it
    }
  })
  return topics
}

async function findAllMessages (name) {
  let messages = await messageModel.find({})
  return messages
}

async function refresh (name) {
  let users = await findAllUser(name)
  let topics = await findAllTopics(name)
  let messagesAll = await findAllMessages(name)
  let messages = []

  let friendNames =[]
  topics.forEach((it) => {
    let myIndex = it.members.indexOf(name)
    if (myIndex >= 0) {
      if (it.members.length === 2) {
        if (myIndex ===0) {
          friendNames.push(it.members[1])
        }else {
          friendNames.push(it.members[0])
        } 
      }
    }
  })
  users = users.filter((it) => {
    if (friendNames.indexOf(it.name) < 0) return it
  })

  messages = messagesAll.filter((it) => {
    if (topics.map((t) => {return t.id}).indexOf(it.id) >= 0) {
      return it
    }
  })

  let result = {
    a: 'recv', 
    type: 'refresh', 
    tm: Date.now(), 
    users: users.map((it) => {return {name: it.name}}),
    topics,
    messages
  }
  client().send(toString(result))
}

async function Login(data, ws) {
  let user = await userModel.find({
    name: data.name
  })

  if(user) {
    let members = []
    let allUser = await userModel.find({})
    if (allUser.length) {
      members = allUser.map((it) => {return it.name})
    }
    let success = {a: 'recv', type: 'recvLogin', tm: Date.now(), userInfo: {name: data.name}}
    await ws.send(toString(success))
    await talkGroup(members)
    await refresh(data.name)
  }
}

async function talkGroup (members) {
  let id = 10000
  let result = await topicsModel.find({id})
  if (result.length) {
    await topicsModel.update(
      {
        id
      },
      {
        members
      }
    )
  } else {
    await topicsModel.create({
      id,
      members
    })
  }
}

async function addFriend({name, members, userName}) {
  let user = await userModel.find({
    name: name
  })
  if (user.length) {
    let result = await topicsModel.create({
      id: Date.now(),
      members: members
    })

    client().send(toString({a: 'recv', type:'recvAddFriend', tm: Date.now(), status: true}))
    refresh(userName)
  } else {
    client().send(toString({a: 'recv', type:'recvAddFriend', tm: Date.now(), status: false}))
  }
}

async function sendMessage ({topic, userName, message, t}) {
  let topicDB = await topicsModel.find({
    id: topic
  })

  if (topicDB.length) {
    let result = await messageModel.create({
      id: topic,
      content: message,
      t: t,
      tm: Date.now(),
      send: userName
    })
    if (result) {
      refresh(userName)
    } else {
      client().send(toString({a: 'recv', type:'recvMessage', tm: Date.now(), status: false}))
    }
  } else {
    client().send(toString({a: 'recv', type:'recvMessage', tm: Date.now(), status: false}))
  }
}


function toString(data) {
  return JSON.stringify(data)
}

wss.broadcast = (data, ws) => {
  if (data.a === 'm') {
    if(data.type === 'register') {
      Register(data, ws)
      return
    }
    if(data.type === 'login') {
      Login(data, ws)
      return
    }
    if (data.type === 'addFriend') {
      addFriend({name: data.name, userName: data.userName, members: [data.name, data.userName]}, ws)
      return
    }
    if (data.type === 'message') {
      sendMessage({topic: data.topic, userName: data.userName, message: data.message, t: data.t}, ws)
      return
    }
  }
}

wss.on('connection', (ws) => {
  ws.on('message', (data, flags) => {
    if(data === 'PING') {
      ws.send('PONG')
    } else {
      wss.broadcast(JSON.parse(data), ws)
    }
  })
})
