#!/usr/bin/env node

'use strict'
// 获取nodejs版本号
var currentNodeVersion = process.versions.node
console.log('currentNodeVersion', currentNodeVersion)
var semver = currentNodeVersion.split('.')
var major = semver[0] // 获取大版本号

if (major < 8) {
  console.error(
    `You are running node ${major}.
    Create Demacia App requires Node 8 or higher.
    Please update your version of Node`
  )
  process.exit(1)
}

require('./demaciaCli')
