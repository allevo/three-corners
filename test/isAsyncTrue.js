'use strict'

async function a () { }

var isAsync = require('../').isAsync

module.exports = function (t) {
  t.equal(isAsync(a), true)
  t.done()
}
