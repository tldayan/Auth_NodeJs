const User = require("../model/User") 


const handleLogout = async(req,res) => {
    // On client(Frontend), also delete the access token.

     const cookies = req.cookies

     if(!cookies?.jwt) {
        return res.sendStatus(204) // No content to send back
     }
        const refreshToken = cookies.jwt

     // Is refreshToken in DB?
    const foundUser = await User.findOne({refreshToken}).exec() // since "refreshToken" is the same variabe, we can just pass "refreshToken"
     if(!foundUser) {
        res.clearCookie("jwt", {httpOnly : true})
        return res.sendStatus(204) 
     }

    //Delete the refresh token in the database
     foundUser.refreshToken = ""
     const result = await foundUser.save();
     console.log(result)
     
     res.clearCookie("jwt", {httpOnly : true} )//in production make sure to add "secure : true", so that its secure, in development we are just using http
     res.sendStatus(204)
   }

module.exports = {handleLogout}