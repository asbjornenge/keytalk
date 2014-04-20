var chalk  = require('chalk')
var moment = require('moment')
var _      = require('lodash')


function align(str, len, c) {
    if (str.length > len) return str.slice(0,len)
    c = c || ' '
    return str + _.range(len - str.length).reduce(function(p) { return p+c },'')
}

var out = {
    list : function(messages) {
        messages.forEach(function(message, index) {
            console.log(
                chalk.blue(align(message.from, 15)) + 
                chalk.white(' | ') +
                chalk.green(align(moment(message.date).format('MMMM Do YYYY, h:mm:ss a'),30)) + 
                chalk.white(' | ') +
                chalk.yellow('#'+index) +
                chalk.red(message.read ? '  ' : ' *')
            )
        })
    }
}

module.exports = out