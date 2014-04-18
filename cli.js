#!/usr/bin/env node
var Firebase = require('firebase')
var args     = require('optimist').argv
var keytalk  = require('./index.js')

var root = new Firebase("https://keytalk.firebaseio.com")
var talk = keytalk(root)

function help() {
    console.log('Usage')
    console.log('  $ keytalk <username> -m "message"')
}

talk.read_config(function() {

    if (args['_'].length == 0) { help(); process.exit(0) }

    if (args['_'][0] == 'unread') {
        talk.unread(function(data) {
            console.log(data)
            process.exit(0)
        })
    }
    else {
        talk.send(args['_'][0], args['m'], function(err) {
            if (err) { console.log(err); process.exit(1) }
            else     { console.log('Message sendt.'); process.exit(0) }
        })
    }
    // console.log(this.config, args)

    // process.exit(0)

}.bind(talk))