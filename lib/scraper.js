var missi = require('mississippi')
var trumpet = require('trumpet')

var WEB_DOUJINDOU_COM = 'http://web.doujindou.com'

module.exports = function scraper () {
  var ws = trumpet()
  var rs = missi.through.obj()
  var c = 0
  var isEnded = false

  ws.selectAll('.top_newbox', function (aNode) {
    c += 1
    var o = {}
    var tr = trumpet()
    tr.select('.top_newboximg a img', function (img) {
      img.getAttribute('src', function (src) {
        o.srcOfThumbnail = src
        tr.select('.top_newitem_name a', function (a) {
          a.getAttribute('href', function (href) {
            o.urlOfTitle = WEB_DOUJINDOU_COM + href
            var b = []
            missi.pipe(
              a.createReadStream(),
              missi.through.obj(function (r, _, d) {
                b.push(r); d()
              }, function (d) {
                o.title = Buffer.isBuffer(b[0])
                  ? String(Buffer.concat(b))
                  : b.join('')
                d()
              }),
              function (err) {
                if (err) rs.emit('error', err)
                tr.select('.top_newcircle_name a', function (a) {
                  a.getAttribute('href', function (href) {
                    o.urlOfCircle = WEB_DOUJINDOU_COM + href
                    var b = []
                    missi.pipe(
                      a.createReadStream(),
                      missi.through.obj(function (r, _, d) {
                        b.push(r); d()
                      }, function (d) {
                        o.circle = Buffer.isBuffer(b[0])
                          ? String(Buffer.concat(b))
                          : b.join('')
                        d()
                      }),
                      function (err) {
                        if (err) rs.emit('error', err)
                        rs.write(o)
                        if ((c -= 1) === 0 && isEnded) rs.end()
                      }
                    )
                  })
                })
              }
            )
          })
        })
      })
    })
    aNode.createReadStream().pipe(tr)
  })

  ws.once('end', function () {
    if (c === 0) rs.end()
    else (isEnded = true)
  })

  return missi.duplex.obj(ws, rs)
}
