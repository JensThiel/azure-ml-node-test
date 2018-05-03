const http = require("http");
var express = require("express");
var app = express();
const path = require('path');
const api_key = require('./keys');

var bodyParser = require("body-parser");

const httpServer = http.createServer(app);


// parse application/x-www-form-urlencoded

app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

//serve static file (index.html, images, css)
app.use(express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


app.use('/', require("./routes/main"));
app.use('/api', require("./routes/api"));


/**
 * Any other routes return 404
 */
app.get("*", function (req, res) {
  res.status(404).render("error", {
      title: "404 Not Found",
      error: "Your URL is incorrect."
  });
});

var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log(
    "To view your app, open this link in your browser: http://localhost:" + port
  );
});
