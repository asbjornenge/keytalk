var fs     = require('fs')
var mkdirp = require('mkdirp')
var spawn  = require('child_process').spawn
var moment = require('moment')
var utils  = require('./utils')

var keytalk = function(root) {
    this.root = root
}
keytalk.prototype.read_config = function(callback) {
    fs.readFile(utils.getUserHome()+'/.keybase/config.json', 'utf8', function(err, data) {
        if (err) { 
            console.log('Unable to find keybase configuration file. Make sure keybase is installed and registered.')
            process.exit(1) 
        }
        this.config = JSON.parse(data)
        if (typeof callback == 'function') callback(this)
    }.bind(this))
    return this
}
keytalk.prototype.process = function(args, callback) {
    var p = spawn('keybase',args)
    p.stdout.on('data', function(data) {
        if (typeof callback == 'function') callback(data)
    })
}
keytalk.prototype.encrypt = function(username, message, callback) {
    this.process(['encrypt',username,'-m',message], callback)
}
keytalk.prototype.decrypt = function(filepath, callback) {
    this.process(['decrypt',filepath], callback)
}
keytalk.prototype.send = function(username, message, callback) {
    this.encrypt(username, message, function(data) {
        var date = new Date().getTime()
        var mref = this.root.child(username).push({
            message : data.toString(),
            from    : this.config.user.name,
            read    : false,
            date    : date
        }, callback)
    }.bind(this))
    return this
}
keytalk.prototype.list = function(callback, num) {
    num = num || 10
    this.root.child(this.config.user.name).limit(num).once('value', function(data) {
        var _data = data.val()
        var list  = Object.keys(_data).map(function(key) {
            var d = _data[key]; d['id'] = key; return d
        })
        .sort(function(a,b) { 
            if (a.date < b.date) return 1 
            if (a.date > b.date) return -1
            return 0
        })
        if (typeof callback == 'function') callback(list)
    })
    return this
}
keytalk.prototype.read = function(message, callback) {
    var path = '/tmp/keytalk'
    mkdirp(path, function(err) {
        if (err) { console.log(err); process.exit(1) }
        fs.writeFile(path+'/'+message.id, message.message, function(err) {
            if (err) { console.log(err); process.exit(1) }
            this.decrypt(path+'/'+message.id, callback)
        }.bind(this))
        this.root.child(this.config.user.name).child(message.id+'/read').set(true)
    }.bind(this))
}
// keytalk.prototype.read = function(id, callback) {
//     this.root.child(this.config.user.name).child(id).once('value', function(data) {
//         var tmpfile = '/tmp/'+id
//         fs.writeFile(tmpfile, data.val().message, function(err) {
//             if (err) { console.log(err); process.exit(1) }
//             this.decrypt(tmpfile, callback)
//         }.bind(this))
//         this.root.child(this.config.user.name).child(id+'/read').set(true)
//     }.bind(this))
// }

module.exports = function(root) { return new keytalk(root) }
