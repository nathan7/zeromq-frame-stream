# zeromq-frame-stream

  Encode and decode streams of ZMTP (ZeroMQ Message Transport Protocol) *frames*.

## Installation

    npm install zeromq-frame-stream

## API

## zmtpfs(stream) -> DuplexStream

  Reads and writes ZMTP frames to/from the passed stream.
  Reads and writes arrays of buffers.

## zmtpfs.Framer() -> TransformStream

  Creates a new framing stream.
  Reads arrays of buffers (or things that can be turned into buffers).
  Outputs ZMTP frames to the other side of the stream.

### zmtpfs.DeFramer() -> TransformStream

  Creates a new deframing stream.
  Reads ZMTP frames.
  Outputs arrays of buffers.

## Example

```js
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
```

```js
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
```
