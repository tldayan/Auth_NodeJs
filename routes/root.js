const express = require("express")
const router = express.Router()
const path = require("path")


router.get("^/$|/index.html|/index", (req,res) => { // the expression will respond to 3 types of requests: Requests to the root path ("/").Requests to "/index". Requests to "/index.html".
    res.sendFile(path.join(__dirname,"..","views","index.html"))
})



module.exports = router
