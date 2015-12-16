var express = require('express');
var router = express.Router();

var passwordless = require('passwordless')


// respond to a request for a passwordless token

var users = [
    { id: 1, email: 'sam.deere@givingwhatwecan.org' },
    { id: 2, email: 'tara.macaulay@centreforeffectivealtruism.org' }
];
router.post('/request-token',
    passwordless.requestToken(
        function(user, delivery, callback) {
            for (var i = users.length - 1; i >= 0; i--) {
                if(users[i].email === user.toLowerCase()) {
                    return callback(null, users[i].id);
                }
            }
            callback(null, null);
        }),
        function(req, res) {
            res.status(204).send();
        });


router.get('/check-token', passwordless.restricted(),
    function(req,res){
        res.status(204).send();
    })

router.get('/logout', passwordless.logout(),
    function(req, res) {
        res.status(204).send();
    });



module.exports = router;