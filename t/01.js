'use strict'
var test = require('tape')
var webDoujindou = require('../index')
var fs = require('fs')
var path = require('path')
var iconv = require('iconv-lite')
var missi = require('mississippi')

test('var client = new WebDoujindou', t => {
  var c = webDoujindou()
  t.is(c.name, 'web.doujindou.com', 'c.name eq "web.doujindou.com"')
  t.is(c.failAfter, 7, 'c.failAfter === 7')
  t.is(c.charset, 'CP932', 'c.charset eq "CP932"')
  t.is(c.searchHome, 'http://web.doujindou.com/seek/detail.php', 'c.searchHome eq "http://web.doujindou.com/seek/detail.php"')
  t.end()
})

test('var qstr = client.createQuery(paarms)', t => {
  var c = webDoujindou()
  var params = {
    category: 'act',
    value: '守月史貴',
    event: 'c91'
  }
// http://web.doujindou.com/seek/detail.php
// f=seek
// title=
// circle=
// writer=%8E%E7%8C%8E%8E%6A%8B%4D
// category=
// comment=
// event=
// division_age=all
// division_sex=all
// kinds=all
// stock=1
  t.test('var queryObj = client.transformQuery(params)', tt => {
    var o = c.transformQuery(params)
    t.deepEqual(o, {
      f: 'seek',
      title: '',
      circle: '',
      writer: '守月史貴',
      category: '',
      comment: '',
      event: 'c91',
      division_age: 'all',
      division_sex: 'all',
      kinds: 'all',
      stock: 1
    })
    tt.end()
  })

  var qs = c.createQuery(params)
  t.ok(/writer=%8E%E7%8C%8E%8E%6A%8B%4D/.test(qs), qs)
  t.end()
})

test('var stream = client.scraper()', t => {
  var c = webDoujindou()
  var b = []
  var i = 0
  var list = [
    { srcOfThumbnail: 'http://doujindou.com/img/I/8/9/0/8902e3140c7562b0913f5770eb285c32/l_top.jpg',
    urlOfTitle: 'http://web.doujindou.com/view/65683.html',
    title: 'すいーとみるくを召し上がれ2',
    urlOfCircle: 'http://web.doujindou.com/circle/c_5573/',
    circle: 'かみしき' },
    { srcOfThumbnail: 'http://doujindou.com/img/I/7/8/0/780f990b5b7e474fddac1f207b7fa969/l_top.jpg',
    urlOfTitle: 'http://web.doujindou.com/view/65682.html',
    title: '大鳳これくしょん',
    urlOfCircle: 'http://web.doujindou.com/circle/c_5573/',
    circle: 'かみしき' },
    { srcOfThumbnail: 'http://doujindou.com/img/I/f/d/c/fdc43c7197b903c03ce9788842d3d3aa/l_top.jpg',
    urlOfTitle: 'http://web.doujindou.com/view/64704.html',
    title: 'すいーとみるくを召し上がれ',
    urlOfCircle: 'http://web.doujindou.com/circle/c_5573/',
    circle: 'かみしき' },
    { srcOfThumbnail: 'http://doujindou.com/img/I/f/4/e/f4e46ba9669d3a459c71e93e431607b7/l_top.jpg',
    urlOfTitle: 'http://web.doujindou.com/view/61867.html',
    title: '大鳳ちゃんは発情期',
    urlOfCircle: 'http://web.doujindou.com/circle/c_5573/',
    circle: 'かみしき' },
    { srcOfThumbnail: 'http://doujindou.com/img/I/4/6/f/46f7dac067c24f428fe0cb4c4cea9f5e/l_top.jpg',
    urlOfTitle: 'http://web.doujindou.com/view/60852.html',
    title: '花嫁は深海大鳳ちゃん',
    urlOfCircle: 'http://web.doujindou.com/circle/c_5573/',
    circle: 'かみしき' },
    { srcOfThumbnail: 'http://doujindou.com/img/I/3/0/e/30e03b2e226874421fab6fdfc512aa89/l_top.jpg',
    urlOfTitle: 'http://web.doujindou.com/view/60851.html',
    title: 'カンムス×セイフクH',
    urlOfCircle: 'http://web.doujindou.com/circle/c_5573/',
    circle: 'かみしき' },
    { srcOfThumbnail: 'http://doujindou.com/img/I/a/c/1/ac18fa710ccfcecb855d10777186baec/l_top.jpg',
    urlOfTitle: 'http://web.doujindou.com/view/59555.html',
    title: 'ゼリービーンズ',
    urlOfCircle: 'http://web.doujindou.com/circle/c_5573/',
    circle: 'かみしき' },
    { srcOfThumbnail: 'http://doujindou.com/img/I/d/5/9/d597e048314596beebb1dba1248fc184/l_top.jpg',
    urlOfTitle: 'http://web.doujindou.com/view/59424.html',
    title: '大鳳が深海棲艦に堕チタラ',
    urlOfCircle: 'http://web.doujindou.com/circle/c_5573/',
    circle: 'かみしき' },
    { srcOfThumbnail: 'http://doujindou.com/img/I/b/f/3/bf3006020313e7c39789d2171f4e98ab/l_top.jpg',
    urlOfTitle: 'http://web.doujindou.com/view/59423.html',
    title: '大鳳ちゃんとかくれんぼ',
    urlOfCircle: 'http://web.doujindou.com/circle/c_5573/',
    circle: 'かみしき' },
    { srcOfThumbnail: 'http://doujindou.com/img/I/7/f/1/7f1019eb009c378fa88fda7791ef14c6/l_top.jpg',
    urlOfTitle: 'http://web.doujindou.com/view/59422.html',
    title: '大鳳ちゃんとこたつみかん',
    urlOfCircle: 'http://web.doujindou.com/circle/c_5573/',
    circle: 'かみしき' },
    { srcOfThumbnail: 'http://doujindou.com/img/I/9/8/c/98c0061232e69721a6bad0927408bc9e/l_top.jpg',
    urlOfTitle: 'http://web.doujindou.com/view/59421.html',
    title: '大鳳ちゃんとばんそーこー',
    urlOfCircle: 'http://web.doujindou.com/circle/c_5573/',
    circle: 'かみしき' }
  ]

  missi.pipe(
    fs.createReadStream(path.join(__dirname, 'moritsuki.html')),
    iconv.decodeStream(c.charset),
    c.scraper(),
    missi.through.obj((o, _, d) => {
      t.deepEqual(list[i], o, JSON.stringify(o))
      i += 1
      d()
    }),
    err => {
      t.notOk(err, 'no exits error')
      t.is(i, 11, 'items length 11')
      t.end()
    }
  )
})
