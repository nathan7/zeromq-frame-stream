'use strict';
// echo/shutdown server
var net = require('net')
  , zmtpfs = require('./')

net.createServer(function(sock) {
  var z = zmtpfs(sock)
  z.on('data', function(messages) {
    if (messages[0] == 'shutdown')
      process.exit()
    else
      z.write(messages)
  })
}).listen(1337)

