'use strict';
// echo/shutdown client
var net = require('net')
  , zmtpfs = require('./')

net.connect(1337, function(sock) {
  var z = new zmtpfs.Framer()

  z.on('data', console.log)
  z.pipe(this)

  z.write([new Buffer([0x01, 0x02, 0x03, 0x04])])
  z.write([new Buffer([0x05, 0x06, 0x07, 0x08])])
  z.write(['shutdown'])
})
