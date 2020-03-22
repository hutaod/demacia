'use strict'

const chalk = require('chalk')
const commander = require('commander')
const dns = require('dns')
const envinfo = require('envinfo')
const execSync = require('child_process').execFileSync
const fs = require('fs-extra')
const hyperquest = require('hyperquest')
