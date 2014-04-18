var chalk  = require('chalk')
var moment = require('moment')

var out = {
    list : function(messages) {
        console.log(chalk.blue('Unread messages:'))
        console.log(chalk.blue('----------------'))
        messages.forEach(function(message) {
            // console.log(message)
            console.log(chalk.red(message.read ? ' ' : '* ') + 
                chalk.blue(message.from) + 
                chalk.white(' | ') +
                chalk.green(moment(message.date).format('MMMM Do YYYY, h:mm:ss a')) + 
                chalk.white(' | ') +
                chalk.yellow(message.message)
            )
        })
    }
}

module.exports = out