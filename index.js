var fs    = require('fs')
var spawn = require('child_process').spawn

function getUserHome() {
  return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
}

var keytalk = function(root) {
    this.root = root
}
keytalk.prototype.read_config = function(callback) {
    fs.readFile(getUserHome()+'/.keybase/config.json', 'utf8', function(err, data) {
        if (err) { 
            console.log('Unable to find keybase configuration file. Make sure keybase is installed and registered.')
            process.exit(1) 
        }
        this.config = JSON.parse(data)
        if (typeof callback == 'function') callback(this)
    }.bind(this))
    return this
}
keytalk.prototype.send = function(username, message, callback) {
    var c = 'keybase encrypt '+username+' -m "'+message+'"'
    var p = spawn('keybase',['encrypt',username,'-m','"'+message+'"'])
    p.stdout.on('data', function (data) {
        var date = new Date().getTime()
        var mref = this.root.child('messages').push({
            message : data.toString(),
            to      : username,
            from    : this.config.user.name,
            date    : date
        }, function(err) {
            if (err) { if (typeof callback == 'function'); callback(err); return }
            this.root.child(username).push({
                message : mref.name(),
                from    : this.config.user.name,
                date    : date
            }, callback)
        }.bind(this))
    }.bind(this))
    p.stderr.on('data', function(data) {
        if (typeof callback == 'function') callback(data.toString())
    })
    return this
}
keytalk.prototype.unread = function(callback, num) {
    num = num || 10
    this.root.child(this.config.user.name).limit(num).once('value', function(data) {
        if (typeof callback == 'function') callback(data.val())
    })
    return this
}

module.exports = function(root) { return new keytalk(root) }
