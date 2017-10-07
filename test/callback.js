'use strict'

var error = new Error('DOOM!')

var wrapCallback = require('../').wrapCallback

module.exports = function (t) {
  t.plan(4)

  t.test('no args', function (t) {
    t.plan(4)

    t.test('sync', function (t) {
      t.plan(2)

      var wrapped = wrapCallback(noExtraArgs)

      wrapped(function (err, result) {
        t.error(err)
        t.equal(result, 3)
      })
    })

    t.test('sync error', function (t) {
      t.plan(2)

      var wrapped = wrapCallback(noExtraArgsError)

      wrapped(function (err, result) {
        t.equal(err, error)
        t.equal(result, undefined)
      })
    })

    t.test('delayed', function (t) {
      t.plan(2)

      var wrapped = wrapCallback(noExtraArgsDelayed)

      wrapped(function (err, result) {
        t.error(err)
        t.equal(result, 3)
      })
    })

    t.test('delayed error', function (t) {
      t.plan(2)

      var wrapped = wrapCallback(noExtraArgsErrorDelayed)

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

      var wrapped = wrapCallback(oneArgument)

      wrapped(3, function (err, result) {
        t.error(err)
        t.equal(result, 6)
      })
    })

    t.test('error', function (t) {
      t.plan(2)

      var wrapped = wrapCallback(oneArgumentError)

      wrapped(3, function (err, result) {
        t.equal(err, error)
        t.equal(result, undefined)
      })
    })

    t.test('delayed', function (t) {
      t.plan(2)

      var wrapped = wrapCallback(oneArgumentDelayed)

      wrapped(3, function (err, result) {
        t.error(err)
        t.equal(result, 6)
      })
    })

    t.test('error delayed', function (t) {
      t.plan(2)

      var wrapped = wrapCallback(oneArgumentErrorDelayed)

      wrapped(3, function (err, result) {
        t.equal(err, error)
        t.equal(result, undefined)
      })
    })
  })

  t.test('lot of arguments', function (t) {
    t.plan(4)

    t.test('sync', function (t) {
      t.plan(2)

      var wrapped = wrapCallback(lotOfArguments)

      wrapped(1, 2, 3, 4, 5, 6, function (err, result) {
        t.error(err)
        t.equal(result, 21)
      })
    })

    t.test('error', function (t) {
      t.plan(2)

      var wrapped = wrapCallback(lotOfArgumentsError)

      wrapped(1, 2, 3, 4, 5, 6, function (err, result) {
        t.equal(err, error)
        t.equal(result, undefined)
      })
    })

    t.test('delayed', function (t) {
      t.plan(2)

      var wrapped = wrapCallback(lotOfArgumentsDelayed)

      wrapped(1, 2, 3, 4, 5, 6, function (err, result) {
        t.error(err)
        t.equal(result, 21)
      })
    })

    t.test('error delayed', function (t) {
      t.plan(2)

      var wrapped = wrapCallback(lotOfArgumentsErrorDelayed)

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
      func: function (callback) {
        callback(null, this.b)
      },
      func2: function (a, b, c, callback) {
        callback(null, this.b + a + b + c)
      }
    }

    t.test('on args', function (t) {
      t.plan(2)

      var wrapped = wrapCallback('func', obj)

      wrapped(function (err, result) {
        t.error(err)
        t.equal(result, 66)
      })
    })

    t.test('multiple args', function (t) {
      t.plan(2)

      var wrapped = wrapCallback('func2', obj)

      wrapped(1, 2, 3, function (err, result) {
        t.error(err)
        t.equal(result, 66 + 1 + 2 + 3)
      })
    })
  })
}

function noExtraArgs (callback) {
  callback(null, 3)
}

function noExtraArgsError (callback) {
  callback(error)
}

function noExtraArgsDelayed (callback) {
  setTimeout(callback, 10, null, 3)
}

function noExtraArgsErrorDelayed (callback) {
  setTimeout(callback, 10, error)
}

function oneArgument (n, callback) {
  callback(null, n * 2)
}

function oneArgumentError (n, callback) {
  callback(error)
}

function oneArgumentDelayed (n, callback) {
  setTimeout(callback, 10, null, n * 2)
}

function oneArgumentErrorDelayed (n, callback) {
  setTimeout(callback, 10, error)
}

function lotOfArguments (a, b, c, d, e, f, callback) {
  callback(null, a + b + c + d + e + f)
}

function lotOfArgumentsError (a, b, c, d, e, f, callback) {
  callback(error)
}

function lotOfArgumentsDelayed (a, b, c, d, e, f, callback) {
  setTimeout(callback, 10, null, a + b + c + d + e + f)
}

function lotOfArgumentsErrorDelayed (a, b, c, d, e, f, callback) {
  setTimeout(callback, 10, error)
}

if (require.main === module) {
  var t = require('tap')
  module.exports(t)
}
