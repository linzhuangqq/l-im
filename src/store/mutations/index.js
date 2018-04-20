export function updateStateUserInfo (_, {name}) {
  return {userInfo: {name}}
}

export function selectTopic ({state: {messages}}, currentTopicId) {
  return {
    currentTopicId,
    currentMessages: messages.filter((it) => {
      if (+it.id === +currentTopicId) {
        return it
      }
    })
  }
}

export function refreshCurrentMessages ({state: {currentTopicId}}, {messages, topics}) {
  return {
    currentMessages: messages.filter((it) => {
      if (+it.id === +currentTopicId) {
        return it
      }
    }),
    topics: topics.map((it) => {
      let times = []
      let titles = {}
      messages.filter((m) => {
        if (m.id === it.id) {
          times.push(m.tm)
          titles[m.tm] = m.content
          return m
        }
      })
      if (times.length > 0) {
        it.time = Math.max.apply([], times)
        it.title = titles[it.time]
      } else {
        it.time = 0
        it.title = ''
      }
      return it
    }).sort((a, b) => {
      return a.time < b.time
    })
  }
}
