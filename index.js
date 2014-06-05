'use strict';
var DeFramer = require('binary-parse-stream').extend(require('zeromq-frame-parser/parser'))
  , writer = require('zeromq-frame-writer')
  , inherits = require('util').inherits
  , Stream = require('stream')
  , TransformStream = Stream.Transform
  , DuplexStream = Stream.Transform

module.exports = exports = Magic
inherits(Magic, DuplexStream)
function Magic(stream, opts) {
  if (!this || this === global) return new Magic(stream, opts)

  var myOpts = Object.create(opts || {})
  myOpts.objectMode = true
  DuplexStream.call(this, myOpts)

  ;(this._stream = stream).pipe(this._parser = new DeFramer(opts))
}

Magic.prototype._write = function(messages, _, cb) { var self = this
  writer(messages, function(frame, cb) {
    self._stream.write(frame, cb)
  }, cb)
}

Magic.prototype._read = function() { var self = this
  this._parser.once('readable', function() {
    self.push(this.read())
  })
}

exports.Framer = Framer
inherits(Framer, TransformStream)
function Framer(opts) {
  if (this === exports || this === global) return new Framer(opts)
  TransformStream.call(this, opts)
  this._writableState.objectMode = true
  this._readableState.objectMode = false
}

Framer.prototype._transform = function(messages, _, cb) { var self = this
  writer(messages, function(frame, cb) {
    self.push(frame)
    if (cb) cb()
  }, cb)
}
