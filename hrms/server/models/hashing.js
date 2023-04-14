const crypto = require("crypto");
const saltRounds = 15;


const getHashSalt = (plaintext) => {
    if(!plaintext) {
        return;
    }

    let returnHash = {}
    try {
        let salt = crypto.randomBytes(16).toString('hex');
        let hash = crypto.pbkdf2Sync(plaintext, salt, 20, 64, 'sha512').toString('hex');             
        returnHash = {salt: salt, hash: hash}
    } catch (error) {        
        
    }
    return returnHash
}


const comparePasswordAndSalt = (pass, salt) => {
    if(!pass || !salt) {
        return;
    }

    let returnHash = {status: "fail"}
    try {
        let salt = crypto.randomBytes(16).toString('hex');
        let hash = crypto.pbkdf2Sync(password, this.salt, 20, 64, 'sha512').toString('hex'); 
    } catch (error) {        
    }
    return returnHash
}


module.exports = {
    getHashSalt,
    comparePasswordAndSalt
}