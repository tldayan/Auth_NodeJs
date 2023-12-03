const express = require("express");
const app = express();

const path = require("path");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const { logger } = require("./middleware/logEvents");
const errorHandler = require("./middleware/errorHandler");
const verifyJWT = require("./middleware/verifyJWT")
const cookieParser = require("cookie-parser")
const credentials = require("./middleware/credentials")
const mongoose = require("mongoose")
const connectDB = require("./config/dbConn")
const PORT = process.env.PORT || 3200;

//Connect to MongoDB
connectDB()



//custom middleware logger
app.use(logger);


// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);


//cross origin resource sharing
app.use(cors(corsOptions));

//built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

//built-in middleware for json
app.use(express.json());

//middleware for cookies
app.use(cookieParser())

app.use("/", express.static(path.join(__dirname, "/public")));

app.use("/", require("./routes/root"));
app.use("/register", require("./routes/register"));
app.use("/auth", require("./routes/auth"));
app.use("/refresh", require("./routes/refresh"));
app.use("/logout", require("./routes/logout"));

app.use(verifyJWT); // This is used to authorize the user, if yes, then they will be able to access the employees
app.use("/employees", require("./routes/api/employees"));

app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ error: "404 Not Found" });
  } else {
    res.type(".txt").send("404 Not Found");
  }
});

app.use(errorHandler);


//the server is only gonna listen to request if we have sucessfully contected to MongoDB
mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB")
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})

