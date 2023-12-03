const http = require('http');
const path = require('path');
const fs = require('fs');
const fsPromises = require('fs').promises;

const logEvents = require('./middleware/logEvents');
const EventEmitter = require('events');
class Emitter extends EventEmitter { };
// initialize object 
const myEmitter = new Emitter();
myEmitter.on("log", (msg,fileName) => logEvents(msg, fileName))
const PORT = process.env.PORT || 3000;


const serveFile = async(filePath,contentType,response) => {

    try {
        const rawData = await fsPromises.readFile(
            filePath,
             !contentType.includes("image") ? "utf8" : ""
        )
        const data = contentType === "application/json" 
            ? JSON.parse(rawData) : rawData
        response.writeHead(
            filePath.includes("404.html") ? 404 : 200 ,
             {"Content-Type" : contentType}
        )
        response.end(
            contentType === "application/json" ? JSON.stringify(data) : data
        )

    } catch (err) {
        console.log(err)
        myEmitter.emit("log", `${err.name}:${err.message}`, "errLog.txt")
        response.statusCode = 500
        response.end()
    }

}

const server = http.createServer((req,res) => {
    console.log(req.url,req.method)

    myEmitter.emit("log", `${req.url}\t${req.method}`, "reqLog.txt")

    const extension = path.extname(req.url)

    let contentType;

    if(extension === ".css") {
        contentType = 'text/css'
        
    } else if (extension === '.js') {
        contentType = 'text/javascript'

    } else if (extension === '.js') {
        contentType = 'text/javascript'

    } else if (extension === '.json') {
        contentType = 'application/json'
    
    } else if (extension === '.jpg') {
        contentType = 'image/jpeg'
    
    } else if (extension === '.png') {
        contentType = 'image/png'
    
    } else if (extension === '.txt') {
        contentType = 'text/plain'
    } else {
        contentType = 'text/html'
    }

    let filePath =
        contentType === 'text/html' && req.url === '/'
            ? path.join(__dirname, 'views', 'index.html')
            : contentType === 'text/html' && req.url.slice(-1) === '/'
                ? path.join(__dirname, 'views', req.url, 'index.html')
                : contentType === 'text/html'
                    ? path.join(__dirname, 'views', req.url)
                    : path.join(__dirname, req.url);


    //makes the .html ext not required in the browser
    if(!extension && req.url.slice(-1) !== "/") {
        filePath += ".html"
    } 

    const fileExists = fs.existsSync(filePath)

    if(fileExists) {

        serveFile(filePath,contentType,res)

    } else {


        if(path.parse(filePath).base === "old-page.html") {
            res.writeHead(301,{"Location" : "/new-page.html"})
            res.end()
        } else if(path.parse(filePath).base === "www-page.html") {
            res.writeHead(301,{"Location" : "/"})
            res.end()
        } else {
            serveFile(path.join(__dirname,"views","404.html"),"text/html",res)
        }



        switch(path.parse(filePath).base) {
            case `old-page-html`:
                res.writeHead(301,{"Location" : "/new-page.html"})
                res.end();
                break;
            case `www-page.html`:
                res.writeHead(301,{"Location" : "/"})
                res.end();
                break; 
            default:

        }
    }

})


server.listen(PORT, () => console.log(`Server running on port ${PORT}`));