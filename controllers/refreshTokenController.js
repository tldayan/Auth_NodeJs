const User = require("../model/User")
const path = require("path")
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })

const jwt = require("jsonwebtoken")


const handleRefreshToken = async(req,res) => {
     const cookies = req.cookies

     if(!cookies?.jwt) {
        return res.sendStatus(401) // if jwt is not there in the cookie of the client, then they are unauthorized
     }
     const refreshToken = cookies.jwt

    const foundUser = await User.findOne({refreshToken}).exec() // since "refreshToken" is the same variabe, we can just pass "refreshToken"
     if(!foundUser) { 
        return res.sendStatus(403) // the user does not have a refresh token, or has not created one
     }

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err,decoded) => {

            if(err || foundUser.username !== decoded.username) {
                return res.sendStatus(403) // If token was tampered with, then the user is not allowed
            }

            const roles = Object.values(foundUser.roles)

            const accessToken = jwt.sign(
                {"UserInfo" : {
                    "username" : foundUser.username,
                    "roles" : roles
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                {"expiresIn" : "30s"} // Normally this should be 10-15 mins, 30s is just for testing.
            );

            res.json(accessToken)
        }
    )
}

module.exports = {handleRefreshToken}