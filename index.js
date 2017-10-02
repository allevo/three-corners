/* eslint new-parens: 0 */
'use strict'

var AsyncFunction = function () {}
try {
  AsyncFunction = require('./async.es7')
} catch (e) { }

function wrapAsync (func) {
  var functionLength = func.length

  var c = []
  for (var i = 0; i < functionLength; i++) {
    c.push(String.fromCharCode(65 + i))
  }

  var code = '\n'
  code += 'try {\n'
  code += '  done(null, await func(' + c.join(', ') + '))\n'
  code += '} catch (e) {\n'
  code += '  done(e)\n'
  code += '}\n'

  var argNames = [null, 'func']
  argNames = argNames.concat(c)
  argNames.push('done')
  argNames.push(code)

  var newFunc = new (AsyncFunction.bind.apply(AsyncFunction, argNames))

  return newFunc.bind(null, func)
}

function wrapPromise (func) {
  var functionLength = func.length

  var c = []
  for (var i = 0; i < functionLength; i++) {
    c.push(String.fromCharCode(65 + i))
  }

  var code = 'function passToDone(r) { done(null, r) }\n'
  code += 'func(' + c.join(', ') + ')\n'
  code += '  .then(passToDone, done)\n'

  var argNames = [null, 'func']
  argNames = argNames.concat(c)
  argNames.push('done')
  argNames.push(code)

  var newFunc = new (Function.bind.apply(Function, argNames))

  return newFunc.bind(null, func)
}

function wrapCallback (func) {
  var functionLength = func.length

  var c = []
  for (var i = 0; i < functionLength; i++) {
    c.push(String.fromCharCode(65 + i))
  }

  var code = 'func(' + c.join(', ') + ', done)\n'

  var argNames = [null, 'func']
  argNames = argNames.concat(c)
  argNames.push('done')
  argNames.push(code)

  var newFunc = new (Function.bind.apply(Function, argNames))

  return newFunc.bind(null, func)
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
