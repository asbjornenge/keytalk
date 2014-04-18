var assert  = require('assert')
var keytalk = require('../index.js')

var fakeref     = {}
fakeref.name    = function() { return 'adag987ag98a7dg' }
fakeref.val     = function() { return { fakeref : true } }
var fakequery   = {}
var fakechild   = {}
fakechild.push  = function(data, cb) { setTimeout(function() { cb(null) },200); return fakeref }
fakechild.limit = function() { return fakechild }
fakechild.once  = function(data, cb) { cb(fakeref)   }
var fakeroot    = {}
fakeroot.child  = function() { return fakechild }

describe('KEYTALK', function() {

    it('Can read the keybase config', function() {
        var talk = keytalk(fakeroot)
        talk.read_config(function() {
            assert(talk.config.user.name == 'asbjornenge')
        })
    })

    // Temporarily commented out since it's so slow
    //
    // it('Can send messages', function(done) {
    //     keytalk(fakeroot).read_config(function(talk) {
    //         talk.send('asbjornenge', 'Some speak of the future', function(err) {
    //             assert(!err)
    //             done()
    //         })
    //     })
    // })

    it('It can list unread messages', function(done) {
        var k = keytalk(fakeroot)
        k.read_config(function() {
            this.unread(function(messages) {
                assert(messages)
                done()
            })
        }.bind(k))
    })

})