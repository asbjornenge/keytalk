#!/usr/bin/env node
var Firebase = require('firebase')
var args     = require('optimist').argv
var keytalk  = require('./index.js')

var root = Firebase('https://keytalk.firebaseio.com/')
var talk = keytalk(root)

talk.read_config(function() {

    console.log(this.config, args)

    process.exit(0)

}.bind(talk))