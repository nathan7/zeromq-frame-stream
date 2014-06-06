'use strict';
var BinaryParseStream = require('binary-parse-stream')
  , writer = require('zeromq-frame-writer')
  , inherits = require('util').inherits
  , Stream = require('stream')
  , TransformStream = Stream.Transform
  , DuplexCombo = require('duplex-combination')

module.exports = exports = ZmtpFrameDuplex
inherits(ZmtpFrameDuplex, DuplexCombo)
function ZmtpFrameDuplex(stream, opts) {
  if (!(this instanceof ZmtpFrameDuplex)) return new ZmtpFrameDuplex(stream, opts)

  var decode = new DeFramer()
    , encode = new Framer()

  encode.pipe(stream).pipe(decode)

  DuplexCombo.call(this, decode, encode, opts)
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

exports.DeFramer = DeFramer
inherits(DeFramer, BinaryParseStream)
function DeFramer(opts) {
  if (!(this instanceof DeFramer)) return new DeFramer(opts)
  BinaryParseStream.call(this, opts)
}

DeFramer.prototype._parse = require('zeromq-frame-parser/parser')
