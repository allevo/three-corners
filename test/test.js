'use strict'

var t = require('tap')

var nodejsMajorVersion = process.versions.node.split('.').shift()

t.test('wrap*', function (t) {
  t.plan(3)

  t.test('callback', function (t) {
    require('./callback')(t)
  })

  t.test('promise', function (t) {
    if (nodejsMajorVersion >= '4') {
      require('./promise')(t)
    } else {
      // Skipping!
      t.done()
    }
  })

  t.test('async', function (t) {
    if (nodejsMajorVersion >= '8') {
      require('./async')(t)
    } else {
      // Skipping!
      t.done()
    }
  })
})

t.test('isAsync', function (t) {
  t.plan(2)

  t.test('false', function (t) {
    require('./isAsyncFalse')(t)
  })

  t.test('true', function (t) {
    if (nodejsMajorVersion >= '8') {
      require('./isAsyncTrue')(t)
    } else {
      // Skipping!
      t.done()
    }
  })
})
