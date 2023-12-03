const User = require("../model/User") 

const path = require("path")
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })
const bcrypt = require("bcrypt")

const jwt = require("jsonwebtoken")



const handleLogin = async(req,res) => {
     const {user, pwd} = req.body

     if(!user || !pwd) {
        return res.status(404).json({"message" : `User and password are required`})
     }

    const foundUser = await User.findOne({username : user}).exec()
     if(!foundUser) {
        return res.status(401).json({"message" : `You are not a registered user`})
     }

    try {
        const match = await bcrypt.compare(pwd, foundUser.password);
        if (match) {
            const roles = Object.values(foundUser.roles).filter(Boolean)
            //create JWTs
            const accessToken = jwt.sign(
                {
                    "UserInfo" : {
                        "username" : foundUser.username,
                        "roles" : roles
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                {"expiresIn" : "30s"} // this should normally be 10-15mins
            )
            const refreshToken = jwt.sign(
                {"username" : foundUser.username},
                process.env.REFRESH_TOKEN_SECRET,
                {"expiresIn" : "1d"} // refresh tokens need to last much longer than access tokens 
            )

            //Saving refreshToken with currentUser
            foundUser.refreshToken = refreshToken
            const result = await foundUser.save()
            console.log(result)
            
            res.cookie("jwt", refreshToken, {httpOnly : true, maxAge: 24 * 60 * 60 * 1000}) //in productyion make sure to add "secure : true", so that its secure, in development we are just using http. You might also need to add a "sameSite:"None", but just reaseach and check ..24 * 60 * 60 * 1000 - This is 1 Day
          
            res.json({roles,accessToken}); /* at this point, "accessToken" is a long
            string of random characters, which was converted when you did
            "jwt.sign() for the "accessToken" declaration above.
            Access Tokens should only be stored in memory! */
            
        } else {
            res.status(401).json({ "message": "User not Authorized" });
        }
    } catch (err) {
        res.status(500).json({ "message": err.message });
    }
}

module.exports = {handleLogin}