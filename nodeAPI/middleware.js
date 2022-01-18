const jwt = require('jsonwebtoken')
const tokenSecret = "ldsAS35sYRhd564"

exports.verify = (req, res, next) => {
    console.log(req.headers)
    const token = req.headers.authorization
    if (!token) {res.status(403).json({error: "Access denied."});}
    else {
        console.log(req.headers)
        jwt.verify(token, tokenSecret, (err, value) => {
            if (err) {res.status(500).json({error: 'You do not have the permission to do that'});}
            req.user = value
            next()
        })
    }
}   