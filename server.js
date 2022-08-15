//Install express server
const express = require('express');
const path = require('path');
const cron = require('node-cron');
var request = require('request');

const app = express();

// Serve only the static files form the dist directory
app.use(express.static(__dirname + '/dist'));

app.get('/*', function(req,res) {

  res.sendFile(path.join(__dirname+'/dist/index.html'));
});

cron.schedule('*/60 * * * * *', () => {
  console.log("call") // Print the google web page.
  request('https://alma-app-server.herokuapp.com/api/syndicators/1', function (error, response, body) {
    console.log(response.statusCode) // Print status
  })
})


// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 8080);
