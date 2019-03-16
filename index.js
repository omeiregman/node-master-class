
//Deependencies

const http = require('http');
const config = require('./config');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;


//Instantiating the http server

const app = http.createServer((req, res) => {

    //Get the http Method
    const method = req.method.toLowerCase();

    //Get the URL and parse it
    const parsedUrl = url.parse(req.url, true);

    //Get the path
    const path = parsedUrl.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g, '');

    //Get the payload if any
    const decoder = new StringDecoder('utf-8');
    let buffer = '';
    req.on('data', (data) => {
        buffer += decoder.write(data);
    });

    req.on('end', () => {
        buffer += decoder.end();

        //Choose the handler this request should go to
        const chosenHandler = typeof (router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

        //Construct the data object to send to the handler
        const parsedData = JSON.parse(buffer);

        const data = {
            'response': `Hello ${parsedData.name}, Welcome to the Hello route`,
            'method': method.toUpperCase()
        };

        //Route the request to the handler specified in the handle
        chosenHandler(data, (statusCode, payload) => {
            //Use the status code called back by the handler or default to 200
            statusCode = typeof (statusCode) == 'number' ? statusCode : 200;

            //Use the payload called back by the hajndler or default to an empty object
            payload = typeof (payload) == 'object' ? payload : {};

            //Convert payload to a string
            const payloadString = JSON.stringify(data);

            //Return the response
            res.setHeader('Content-Type', 'application/json');
            res.writeHead(statusCode);

            res.end(payloadString);

            console.log(parsedData);
        })

        //Send the response
        res.end(`Hello World application`);
    })



});
//Start the http server
const port = config.port;

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});


//handlers

const handlers = {};

handlers.notFound = (data, cb) => {
    cb(404);
}

handlers.hello = (data, cb) => {
    cb(200);
}

handlers.default = (data, cb) => {
    cb(200, { 'response': 'Hello World, Welcome to base route!!!' });
}

//Define a request router
const router = {
    'hello': handlers.hello,
    '': handlers.default
}