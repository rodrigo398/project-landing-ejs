const crypto = require('crypto');
var aes_algorithm = "aes-128-ecb";
var aes_secret = process.env.AES_SECRET

module.exports = {
    decryptToken: function(token) {
        var decipher = crypto.createDecipher(aes_algorithm, aes_secret)
        var dec = decipher.update(token, 'hex', 'utf8')
        dec += decipher.final('utf8');
        return dec;
    }
}