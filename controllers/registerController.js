const User = require("../model/User")
const bcrypt = require("bcrypt")


const handleNewUser = async(req,res) => {
    const {user,pwd} = req.body

    if(!user || !pwd) {
     return res.status(400).json({"message" : "Username and password are required"})
    }
    
    /* check for duplicate usernames in the Mongo database */
    const duplicate = await User.findOne({username : user}).exec()
    if(duplicate) {
        return res.status(409).json({"message" : `${user} already exists`})
    }

    try {
        //encrypt the password
        const hashedPwd = await bcrypt.hash(pwd, 10) // the "10" is the salt rounds, which helps protect the passwords if the users database got hacked.
        
        //create and store New user
        const result = await User.create({ // During this operation, MongoDB will automatically create an Object ID. and any default values you have defined in the User schema
            "username" : user,
            "password" : hashedPwd
        })
        console.log(result) 
        
        res.status(201).json({"message" : `New user ${user} created`})
        
    } catch (error) {
        res.status(500).json({"message" : error.message})
    }

}

module.exports = {handleNewUser}