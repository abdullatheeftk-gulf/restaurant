const crypto = require('crypto')



module.exports = {
    genratePassword:async ()=>{
        const password = crypto.randomBytes(4).toString('hex')
        console.log(password);
        return password
    }
}