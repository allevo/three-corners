'use strict'

function a () { }

var isAsync = require('../').isAsync

module.exports = function (t) {
  t.equal(isAsync(a), false)
  t.done()
}
