var express = require('express');
var app = express();
var path = require('path');

// use the express-static middleware
app.use(express.static("public"))

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
    // res.send("<h1>Hello World</h1>");
});

app.listen(process.env.PORT || 3000, function () {
    console.log('Node app is working!');
});