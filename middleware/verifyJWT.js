
const jwt = require("jsonwebtoken")
require("dotenv").config()


const verifyJWT = (req,res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization

    if(!authHeader?.startsWith("Bearer ")) { //Over here your checking if the frontend had used "Bearer " when sending a api request.
        return res.sendStatus(401)
    }

    const token = authHeader.split(" ")[1] /* token here is the same access
            token that was generated in the authcontroller
            File. the "token" has 3 random strings of characterssperated 
            by (.), which represent. username,issue time & expirytime of the JWT */

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET,(err,decoded) => {
        if(err) {return res.sendStatus(403)} // if "err" is true then the whole operation stops and return 403 status to user. because maybe the token was tampered with, or token is not valid.
        req.user = decoded.UserInfo.username, //the reason your doing this is because, req.user needs to be passed down the chain so that it can be used to do other middleware/other stuffs.
        req.roles = decoded.UserInfo.roles /* the "decoded" parameter has access
         to the payload such as the "username",issue time,Expiry time because 
         you assigned the username when you did jwt.sign()
          when declaring "accessToken" in the authController file */
        next(); /* this "next" is used to pass the response eg.(req,res) down the chain */
    }
    )

}

module.exports = verifyJWT