var fs     = require('fs')
var mkdirp = require('mkdirp')
var utils  = require('./utils')

module.exports = {

    store : function(data, callback) {
        var path = utils.getUserHome()+'/.keytalk'
        mkdirp(path, function(err) {
            if (err) { console.log(err); process.exit(1) }
            fs.writeFile(path+'/cache.json', JSON.stringify(data), function(err) {
                if (err) { console.log(err); process.exit(1) }
                if (typeof callback == 'function') callback()
            })
        })
    },

    read : function(callback) {
        fs.readFile(utils.getUserHome()+'/.keytalk/cache.json', 'utf8', function(err, data) {
            if (err) { 
                if (err.errno == 34) { data = "[]" }
                else { console.log(err); process.exit(1) }
            }
            if (typeof callback == 'function') callback(JSON.parse(data))
        })
    }

}