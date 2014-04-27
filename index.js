var fs     = require('fs')
var mkdirp = require('mkdirp')
var spawn  = require('child_process').spawn
var moment = require('moment')
var async  = require('async')
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
keytalk.prototype.process = function(args, suppressOutput, callback) {
    var p = spawn('keybase',args);
    var returnData;
    if (!suppressOutput) {

        p.stderr.pipe(process.stderr, {end: false})
        p.stdout.pipe(process.stdout, {end: false})
        process.stdin.resume()
        process.stdin.pipe(p.stdin, {end:false})
    }
    p.stdout.on('data', function(data) {
        returnData = data;
    })
    p.on('exit', function(code) {
        if (code === 0) { if (typeof callback == 'function') callback(returnData) }
        else { process.exit(code) }
    })
}
keytalk.prototype.encrypt = function(username, message, suppressOutput, callback) {
    this.process(['encrypt',username,'-m',message], suppressOutput, callback)
}
keytalk.prototype.decrypt = function(filepath, suppressOutput, callback) {
    this.process(['decrypt',filepath], suppressOutput, callback)
}
keytalk.prototype.send = function(username, message, callback) {
    // this.encrypt(username, message, function(data) {
    //     var date = new Date().getTime()
    //     var mref = this.root.child(username).push({
    //         message : data.toString(),
    //         from    : this.config.user.name,
    //         read    : false,
    //         date    : date
    //     }, callback)
    // }.bind(this))
    // return this

    var blob = {
        message : message,
        from    : this.config.user.name,
        read    : false,
        date    : new Date().getTime()
    };
    this.encrypt(username, JSON.stringify(blob), function(data) {
        var mref = this.root.child(username).push({
            data    : data.toString(),
            format : 'encrypted-blob'
        }, callback)
    }.bind(this))
    return this
}
keytalk.prototype.list = function(callback, num) {
    num = num || 10
    var talk = this;
    this.root.child(this.config.user.name).limit(num).once('value', function(data) {
        var _data = data.val()
        var list = [];
        var path = '/tmp/keytalk'
        var queue = async.queue(function(d, queuecallback) {
            if (d.format === 'encrypted-blob') {
                fs.writeFile(path+'/'+d.id+'blob', d.data, function(err) {
                    if (err) { console.log(err); process.exit(1) }
                    this.decrypt(path+'/'+d.id+'blob', true, function(data) {
                        
                        var _data = JSON.parse(data.toString());
                        _data['id'] = d.id;
                        _data['encrypted_message'] = false;
                        list.push(_data);
                        queuecallback();
                    })
                }.bind(talk))
            } else {
                d['encrypted_message'] = true;
                list.push(d);
                queuecallback();
            }

        });

        queue.drain = function() {
            
            list.sort(function(a,b) { 
                if (a.date < b.date) return 1 
                if (a.date > b.date) return -1
                return 0
            });
            if (typeof callback == 'function') callback(list)
        };
        Object.keys(_data).map(function(key) {
            var d = _data[key];
            d['id'] = key;
            queue.push(d);
        });
        
        
    })
    return this
}
keytalk.prototype.read = function(message, callback) {
    var path = '/tmp/keytalk'
    mkdirp(path, function(err) {
        if (err) { console.log(err); process.exit(1) }
        fs.writeFile(path+'/'+message.id, message.message, function(err) {
            if (err) { console.log(err); process.exit(1) }
            if (message.encrypted_message === true) {
                this.decrypt(path+'/'+message.id, false, callback)
            } else {
                console.log(message.message);
                callback(message);
            }
        }.bind(this))

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
