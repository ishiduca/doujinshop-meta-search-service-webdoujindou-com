var xtend = require('xtend')
var inherits = require('inherits')
var backoff = require('backoff')
var hyperquest = require('hyperquest')
var Service = require('doujinshop-meta-search-service')

module.exports = WebDoujindou
inherits(WebDoujindou, Service)

function WebDoujindou () {
  if (!(this instanceof WebDoujindou)) return new WebDoujindou()
  Service.call(this, 'web.doujindou.com', {
    charset: 'CP932',
    searchHome: 'http://web.doujindou.com/seek/detail.php'
  })
}

WebDoujindou.prototype.transformQuery = function (_p) {
  var p = xtend(_p)
  var c = {
    mak: 'circle',
    act: 'writer',
    nam: 'title',
    gnr: 'category',
    mch: 'comment',
    com: 'comment',
//    ser: 'comment',
    kyw: 'comment'
  }
  var q = {}; q[c[p.category] || 'comment'] = p.value

  delete p.category
  delete p.value

  return xtend({
    f: 'seek',
    title: '',
    circle: '',
    writer: '',
    category: '',
    comment: '',
    'event': '',
    division_age: 'all',
    division_sex: 'all',
    kinds: 'all',
    stock: 1
  }, q, p)
}

WebDoujindou.prototype._request = function (qstr, requestOpt, onResponse) {
  var uri = this.searchHome + '?' + qstr
  var opt = xtend(requestOpt, {headers: {cookie: 'caution_flag_yes=1'}})
  return backoff.call(hyperquest, uri, opt, onResponse)
}

WebDoujindou.prototype.scraper = require('./lib/scraper')
