var chalk  = require('chalk')
var moment = require('moment')

var out = {
    list : function(messages) {
        messages.forEach(function(message) {
            // console.log(message)
            console.log(
                chalk.blue(message.from) + 
                chalk.white(' | ') +
                chalk.green(moment(message.date).format('MMMM Do YYYY, h:mm:ss a')) + 
                chalk.white(' | ') +
                chalk.yellow(message.id) +
                chalk.red(message.read ? '  ' : ' *')
            )
        })
    }
}

module.exports = out