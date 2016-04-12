'use strict'

const path = require('path')
const glob = require('glob')

module.exports = function (done) {
  // Opal touches these globals
  const opalBridges = [String, Number, Boolean, Date, Array, Error, RegExp, Function]
  opalBridges.forEach(function (bridge) { delete bridge.$$bridge })

  // fresh requires
  const clean = [
    'getOpalCompilerFilename',
    'getCompiler',
    'opal',
    'bundlerCheck',
    'getLoadPaths',
    'getStub',
    'resolveFilename',
    'transpile'
  ]
  const fullPaths = clean.map(function(p) { return path.resolve(__dirname, `../../lib/${p}.js`) })
  fullPaths.forEach(function(p) {
    delete require.cache[p]
  })

  delete require.cache[path.resolve(__dirname, '../../vendor/opal-compiler.js')]
  delete require.cache[path.resolve(__dirname, '../../index.js')]
  delete require.cache[path.resolve(__dirname, 'tweakedOpalCompiler.js')]

  const env = process.env

  // back to original state
  env.OPAL_USE_BUNDLER = 'false'
  delete env.OPAL_COMPILER_PATH
  delete env.OPAL_MRI_REQUIRES
  delete env.OPAL_COMPILER_REQUIRES
  delete env.OPAL_COMPILER_LOAD_PATH

  if (env.BUNDLE_BIN_ORIG) {
    env.BUNDLE_BIN = env.BUNDLE_BIN_ORIG
  }
  else {
    env.BUNDLE_BIN_ORIG = env.BUNDLE_BIN
  }

  if (env.OPAL_LOAD_PATH_ORIG) {
    env.OPAL_LOAD_PATH = env.OPAL_LOAD_PATH_ORIG
  }
  else {
    env.OPAL_LOAD_PATH_ORIG = env.OPAL_LOAD_PATH
  }

  delete env.RAILS_ENV

  const vendorPath = path.resolve(__dirname, '../../vendor')

  glob(path.join(vendorPath, '**/opal-compiler-v*.js'), {}, function(err, files) {
    if (err) { return done(err) }
    files.forEach(function(file) {
      // recreating this messes up mocha watch
      //fs.unlinkSync(file)
      delete require.cache[file]
    })
    return done()
  })
}
