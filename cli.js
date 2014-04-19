#!/usr/bin/env node
var Firebase = require('firebase')
var chalk    = require('chalk')
var args     = require('optimist').argv
var keytalk  = require('./index.js')
var out      = require('./out.js')

var root = new Firebase("https://keytalk.firebaseio.com")
var talk = keytalk(root)

function help() {
    console.log('Usage')
    console.log('  $ keytalk <username> -m "message"')
    console.log('  $ keytalk list')
    console.log('  $ keytalk read <id>')
}

if (args.h || args.help) { help(); process.exit(0) }

talk.read_config(function() {

    if (args['_'].length == 0) { help(); process.exit(0) }

    if (args['_'][0] == 'list') {
        var num = args['_'][1] || 10
        talk.list(function(data) {
            var list = Object.keys(data).map(function(key) { return data[key] })
            out.list(list)
            process.exit(0)
        }, num)
    }
    if (args['_'][0] == 'read') {
        talk.read(process.argv[3], function(message) {
            console.log(message.toString())
            process.exit(0)
        })
    }
    else {
        talk.send(args['_'][0], args['m'], function(err) {
            if (err) { console.log(err); process.exit(1) }
            else     { console.log(chalk.green('Message sendt.')); process.exit(0) }
        })
    }

}.bind(talk))