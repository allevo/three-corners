# three-corners
Unify function interface

## Install

```sh
npm i --save three-corners
```

## Why

Building framework is a difficult task. Your user can use many node versions and want to use their features. The developers want to use new v8 features and the framework needs to be adapted in order to support them.

But commonly the framework defines some interface so the developers can use it better. A typical task is to set a function with a predefined signature (express middleware, mongoose validators, etc...)

This library borns to create a separation between framework code and developer code keeping the same signature.

If you are in that situation, *this library is built for you!*


## Example

Suppose you want to create a middleware system like the express one.

Express defines the interface "Request" instance, "Response" instance, "next" function
```js
function (req, res, next) {
  // ...
  next()
}
```


But you'd like to support the promised and async versions without breaking the compatibility:
```js
function (req, res) {
  // ...
  return Promise.resolve()
}
```
```js
async function (req, res) {
  // ...
  return
}
```

```js
// nodejs 0.10
function doSomething (req, res, next) {
  setTimeout(callback, 10)
}
// nodejs 4
function doSomething (req, res) {
  return Promise.resolve()
}
// nodejs 8
async function doSomething (req, res) {
  await Promise.resolve()
  return
}


// In your framework
var threeCorners = require('three-corners')

var w
// "doSomething" can be one of the above ones
if (threeCorners.isAsync(doSomething)) {
  w = threeCorners.wrapAsync(doSomething)
} else if (doSomething.length === 2) {
  w = threeCorners.wrapPromise(doSomething)
} else if (doSomething.length === 3) {
  w = threeCorners.wrapCallback(doSomething)
} else {
  throw new Error('Wrong interface')
}

// The interface is the same despite "doSomething" nature
w(req, res, function (err, result) {
  // done!
})
```

## Note

- I chose the callback style because this library runs below to `0.8` node version.
- Obviously the performance are impacted because you need to support more kind of function. But please see `benchmark.js`!
