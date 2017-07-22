var doujindou = require('../index')
var dou = doujindou()
var s = dou.createStream()

s.once('data', o => console.log(o))
s.on('error', err => console.error(err))
s.once('end', () => console.log('!! end'))

s.end({
  category: 'act',
  value: '守月史貴'
})
