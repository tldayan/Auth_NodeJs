const mongoose = require("mongoose")
const path = require("path");
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })

const connectDB = async() => {
    try {
        
        await mongoose.connect(process.env.DATABASE_URI, {
            useUnifiedTopology : true,
            useNewUrlParser : true
        })

    } catch (err) {
        console.log(err.message)
    }
}

module.exports = connectDB