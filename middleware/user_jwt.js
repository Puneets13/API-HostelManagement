
const jwt = require('jsonwebtoken')
module.exports.checkauth = function (req, res, next) {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const verify = jwt.verify(token, "@#$#$__NITJALANDHAR_MESSMANGEMENT__@#$#$");
        console.log(verify);
        next();

    }
    catch (error) {
        return res.status(500).json({
            message: "Invalid user cant access the server PLease upload the TOKEN in bearer in POSTMAN"
        })
    }
}



