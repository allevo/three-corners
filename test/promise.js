'use strict'

var error = new Error('DOOM!')

var wrapPromise = require('../').wrapPromise

module.exports = function (t) {
  t.plan(4)

  t.test('on args', function (t) {
    t.plan(4)

    t.test('sync', function (t) {
      t.plan(2)

      var wrapped = wrapPromise(noExtraArgs)

      wrapped(function (err, result) {
        t.error(err)
        t.equal(result, 3)
      })
    })

    t.test('sync error', function (t) {
      t.plan(2)

      var wrapped = wrapPromise(noExtraArgsError)

      wrapped(function (err, result) {
        t.equal(err, error)
        t.equal(result, undefined)
      })
    })

    t.test('delayed', function (t) {
      t.plan(2)

      var wrapped = wrapPromise(noExtraArgsDelayed)

      wrapped(function (err, result) {
        t.error(err)
        t.equal(result, 3)
      })
    })

    t.test('delayed error', function (t) {
      t.plan(2)

      var wrapped = wrapPromise(noExtraArgsErrorDelayed)

      wrapped(function (err, result) {
        t.equal(err, error)
        t.equal(result, undefined)
      })
    })
  })

  t.test('one argument', function (t) {
    t.plan(4)

    t.test('sync', function (t) {
      t.plan(2)

      var wrapped = wrapPromise(oneArgument)

      wrapped(3, function (err, result) {
        t.error(err)
        t.equal(result, 6)
      })
    })

    t.test('sync error', function (t) {
      t.plan(2)

      var wrapped = wrapPromise(oneArgumentError)

      wrapped(3, function (err, result) {
        t.equal(err, error)
        t.equal(result, undefined)
      })
    })

    t.test('delayed', function (t) {
      t.plan(2)

      var wrapped = wrapPromise(oneArgumentDelayed)

      wrapped(3, function (err, result) {
        t.error(err)
        t.equal(result, 6)
      })
    })

    t.test('delayed error', function (t) {
      t.plan(2)

      var wrapped = wrapPromise(oneArgumentErrorDelayed)

      wrapped(2, function (err, result) {
        t.equal(err, error)
        t.equal(result, undefined)
      })
    })
  })

  t.test('lot of arguments', function (t) {
    t.plan(4)

    t.test('sync', function (t) {
      t.plan(2)

      var wrapped = wrapPromise(lotOfArguments)

      wrapped(1, 2, 3, 4, 5, 6, function (err, result) {
        t.error(err)
        t.equal(result, 21)
      })
    })

    t.test('sync error', function (t) {
      t.plan(2)

      var wrapped = wrapPromise(lotOfArgumentsError)

      wrapped(1, 2, 3, 4, 5, 6, function (err, result) {
        t.equal(err, error)
        t.equal(result, undefined)
      })
    })

    t.test('delayed', function (t) {
      t.plan(2)

      var wrapped = wrapPromise(lotOfArgumentsDelayed)

      wrapped(1, 2, 3, 4, 5, 6, function (err, result) {
        t.error(err)
        t.equal(result, 21)
      })
    })

    t.test('delayed error', function (t) {
      t.plan(2)

      var wrapped = wrapPromise(lotOfArgumentsErrorDelayed)

      wrapped(1, 2, 3, 4, 5, 6, function (err, result) {
        t.equal(err, error)
        t.equal(result, undefined)
      })
    })
  })

  t.test('with this', function (t) {
    t.plan(2)

    var obj = {
      b: 66,
      func: function () {
        return Promise.resolve(this.b)
      },
      func2: function (a, b, c) {
        return Promise.resolve(this.b + a + b + c)
      }
    }

    t.test('no args', function (t) {
      t.plan(2)

      var wrapped = wrapPromise('func', obj)

      wrapped(function (err, result) {
        t.error(err)
        t.equal(result, 66)
      })
    })

    t.test('multiple args', function (t) {
      t.plan(2)

      var wrapped = wrapPromise('func2', obj)

      wrapped(1, 2, 3, function (err, result) {
        t.error(err)
        t.equal(result, 66 + 1 + 2 + 3)
      })
    })
  })
}

function noExtraArgs () {
  return Promise.resolve(3)
}

function noExtraArgsError () {
  return Promise.reject(error)
}

function noExtraArgsDelayed () {
  return new Promise(function (resolve) {
    setTimeout(resolve, 10, 3)
  })
}

function noExtraArgsErrorDelayed () {
  return new Promise(function (resolve, reject) {
    setTimeout(reject, 10, error)
  })
}

function oneArgument (n) {
  return Promise.resolve(n * 2)
}

function oneArgumentError (n) {
  return Promise.reject(error)
}

function oneArgumentDelayed (n) {
  return new Promise(function (resolve) {
    setTimeout(resolve, 10, n * 2)
  })
}

function oneArgumentErrorDelayed (n) {
  return new Promise(function (resolve, reject) {
    setTimeout(reject, 10, error)
  })
}

function lotOfArguments (a, b, c, d, e, f) {
  return Promise.resolve(a + b + c + d + e + f)
}

function lotOfArgumentsError (a, b, c, d, e, f) {
  return Promise.reject(error)
}

function lotOfArgumentsDelayed (a, b, c, d, e, f) {
  return new Promise(function (resolve) {
    setTimeout(resolve, 10, a + b + c + d + e + f)
  })
}

function lotOfArgumentsErrorDelayed (a, b, c, d, e, f) {
  return new Promise(function (resolve, reject) {
    setTimeout(reject, 10, error)
  })
}

if (require.main === module) {
  var t = require('tap')
  module.exports(t)
}
