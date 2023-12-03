// this is verifyRoles function is called only after "verifyJWT.js" function is complete. the request is passed down from there to here.
const verifyRoles = (...allowedRoles) => {
    return (req,res,next) => {
         if(!req?.roles) return res.sendStatus(401); //Unauthorized
         const rolesArray = [...allowedRoles]
         console.log(rolesArray)
         console.log(req.roles)
         const result = req.roles.map(role => rolesArray.includes(role)).find(eachValue => eachValue === true) // this will either return true or flase/undefined
        if(!result) return res.sendStatus(401)
        next()
    }
}


module.exports = verifyRoles