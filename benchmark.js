'use stricr'

try {
  var bench = require('fastbench')
} catch (e) {
  console.log()
  console.log('please run')
  console.log('npm i fastbench')
  console.log()
  console.log()
  console.log()
}

const {
  wrapAsync,
  wrapPromise,
  wrapCallback
} = require('./')

async function B1 (arg1, arg2) {
  return await arg1 + arg2
}

function B2 (arg1, arg2) {
  return Promise.resolve(arg1 + arg2)
}

function B3 (arg1, arg2, cbk) {
  process.nextTick(cbk, null, arg1 + arg2)
}

const b1 = wrapAsync(B1)
const b2 = wrapPromise(B2)
const b3 = wrapCallback(B3)

var run = bench([
  async function benchPlainA (done) {
    await B1(2, 3)
    done()
  },
  function benchWrapA (done) {
    b1(2, 3, done)
  },
  function benchPlainP (done) {
    B2(1, 2).then(r => done(r), done)
  },
  function benchWrapP (done) {
    b2(2, 3, done)
  },
  function benchPlainC (done) {
    B3(1, 2, done)
  },
  function benchWrapC (done) {
    b3(2, 3, done)
  }
], 500000)

run(() => run(() => run(run)))
