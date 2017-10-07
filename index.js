/* eslint new-parens: 0 */
'use strict'

var assert = require('assert')

var AsyncFunction = function () {}
try {
  AsyncFunction = require('./async.es7')
} catch (e) { }

function checkParameterTypes (func, that) {
  if (!that) {
    assert.equal('function', typeof func)
  } else {
    assert.equal('string', typeof func)
    assert.equal('object', typeof that)
  }
}

function wrapAsync (func, that) {
  checkParameterTypes(func, that)

  var hasThat = typeof that === 'object'
  var functionLength = func.length
  if (hasThat) {
    functionLength = that[func].length
  }
  var c = []
  for (var i = 0; i < functionLength; i++) {
    c.push(String.fromCharCode(65 + i))
  }

  var code = 'var r\n'
  code += 'try {\n'
  if (hasThat) {
    code += '  r = await this[func](' + c.join(', ') + ')\n'
  } else {
    code += '  r = await func(' + c.join(', ') + ')\n'
  }
  code += '} catch (e) {\n'
  code += '  return done(e)\n'
  code += '}\n'
  code += 'done(null, r)\n'

  var argNames = [null, 'func']
  argNames = argNames.concat(c)
  argNames.push('done')
  argNames.push(code)

  var newFunc = new (AsyncFunction.bind.apply(AsyncFunction, argNames))

  if (hasThat) {
    return newFunc.bind(that, func)
  } else {
    return newFunc.bind(null, func)
  }
}

function wrapPromise (func, that) {
  checkParameterTypes(func, that)

  var hasThat = typeof that === 'object'
  var functionLength = func.length
  if (hasThat) {
    functionLength = that[func].length
  }

  var c = []
  for (var i = 0; i < functionLength; i++) {
    c.push(String.fromCharCode(65 + i))
  }

  var code = 'function passToDone(r) { done(null, r) }\n'
  if (hasThat) {
    code += 'this[func](' + c.join(', ') + ')\n'
  } else {
    code += 'func(' + c.join(', ') + ')\n'
  }
  code += '  .then(passToDone, done)\n'

  var argNames = [null, 'func']
  argNames = argNames.concat(c)
  argNames.push('done')
  argNames.push(code)

  var newFunc = new (Function.bind.apply(Function, argNames))

  if (hasThat) {
    return newFunc.bind(that, func)
  } else {
    return newFunc.bind(null, func)
  }
}

function wrapCallback (func, that) {
  checkParameterTypes(func, that)

  var hasThat = typeof that === 'object'
  var functionLength = func.length
  if (hasThat) {
    functionLength = that[func].length
  }

  var c = []
  for (var i = 0; i < functionLength; i++) {
    c.push(String.fromCharCode(65 + i))
  }
  var hasComma = c.length !== 0
  var code
  if (hasThat) {
    code = 'this[func](' + c.join(', ') + (hasComma ? ',' : ' ') + ' done)\n'
  } else {
    code = 'func(' + c.join(', ') + (hasComma ? ',' : ' ') + ' done)\n'
  }

  var argNames = [null, 'func']
  argNames = argNames.concat(c)
  argNames.push('done')
  argNames.push(code)

  var newFunc = new (Function.bind.apply(Function, argNames))

  if (hasThat) {
    return newFunc.bind(that, func)
  } else {
    return newFunc.bind(null, func)
  }
}

function isAsync (f) {
  return f instanceof AsyncFunction
}

module.exports = {
  wrapCallback: wrapCallback,
  wrapPromise: wrapPromise,
  wrapAsync: wrapAsync,
  isAsync: isAsync
}
