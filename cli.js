#!/usr/bin/env node
var Firebase = require('firebase')
var chalk    = require('chalk')
var opt      = require('optimist')
var keytalk  = require('./index')
var out      = require('./out')
var cache    = require('./cache')

args = opt.usage('Usage: keytalk')
    .options('l', {
        alias   : 'list',
        default : true
    })
    .options('s', {
        alias   : 'sync',
    })
    .options('r', {
        alias : 'read'
    })
    .options('m', {
        alias : 'message'
    })
    .options('h', {
        alias : 'help'
    })    
    .describe('l', 'List cached messages    <num_to_display>')
    .describe('s', 'Sync with server.       <num_to_cache>')
    .describe('r', 'Read a message.         <num>')
    .describe('m', 'Send a message.         <msg> <username>')
    .describe('h', 'Display this help text')
    .argv

var root = new Firebase("https://keytalk.firebaseio.com")

if (args.h || args.help) { console.log(opt.help()); process.exit(0) }

keytalk(root).read_config(function(talk) {

    /* MESSAGE */
    if (args.m) {
        if (args['_'].length == 0) { console.log('Missing recipient username.'); process.exit(1) }
        talk.send(args['_'][0], args['m'], function(err) {
            if (err) { console.log(err); process.exit(1) }
            else     { console.log(chalk.green('Message sent.')); process.exit(0) }
        })
    }
    /* READ */
    else if (args.r != undefined) {
        var num = typeof args.r == 'boolean' ? 0 : args.r
        cache.read(function(data) {
            if (num >= data.length) { console.log('You only have '+data.length+' number of messages available.'); process.exit(1) }
            talk.read(data[num], function(message) {
                console.log(message.toString())
                data[num].read = true
                cache.store(data, function() {
                    process.exit(0)
                })
            })
        })
    }
    /* SYNC */
    else if (args.s) {
        var num = typeof args.s == 'boolean' ? 10 : args.s
        talk.list(function(data) {
            out.list(data)
            cache.store(data, function() {
                process.exit(0)
            })
        }, num)
    }
    /* LIST - DEFAULT */
    else {
        cache.read(function(data) {
            var num = typeof args.l == 'boolean' ? data.length : args.l
            if (data.length == 0) { console.log('No local data found. Consider a keytalk -s to sync some data.'); process.exit(0) }
            out.list(data.slice(0,num))
            process.exit(0)
        })
    }

})
