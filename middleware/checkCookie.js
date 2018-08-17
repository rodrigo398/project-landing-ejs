const decrypt = require('../utils/decrypt');

const middlewares = {

    isLoggedIn: function(req, res, next) {
        if (req.cookies.qesq) {
            const myToken = req.cookies.qesq;
            const decryptToken = JSON.parse(decrypt.decryptToken(myToken));
            req.params.firstname = decryptToken.firstname;
            req.params.lastname = decryptToken.lastname;
            req.params.email = decryptToken.email;
            req.params.islogin = true;
        } else {
            req.params.islogin = false;
        }
        next();
    }
};
module.exports = middlewares;