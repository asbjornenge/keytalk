var chalk  = require('chalk')
var moment = require('moment')
var _      = require('lodash')


function align(str, len, c) {
    if (str.length > len) return str.slice(0,len)
    c = c || ' '
    return str + _.range(len - str.length).reduce(function(p) { return p+c },'')
}

var out = {
    list : function(messages, onlyUnread) {
        var unreadCount = 0;
        messages.forEach(function(message, index) {
            if (!message.read || onlyUnread) {

                console.log(
                    chalk.blue(align(message.from, 15)) + 
                    chalk.white(' | ') +
                    chalk.green(align(moment(message.date).format('MMMM Do YYYY, h:mm:ss a'),30)) + 
                    chalk.white(' | ') +
                    chalk.yellow('#'+index) +
                    chalk.red(message.read ? '  ' : ' *')
                )
                if (!message.read) {
                    unreadCount += 1;
                }
            }
        })
        if (unreadCount === 0 && !onlyUnread) {
            console.log('No new messages. Do \'keytalk -l\' to list previously read messages');
        }
    }
}

module.exports = out