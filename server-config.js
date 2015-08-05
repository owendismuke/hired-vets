var express = require('express');
var request = require('request');
var app = express();

app.set('view engine', 'html');
app.locals.vetApi = 'http://api.dol.gov/V1/VETS100/V100ADataDotGov?$filter=FilingCycle eq 2014&$orderby=NewHire_TotalAllEmployees11 desc&KEY=' + process.env.DOLKEY;
app.locals.vetData = '';
app.use('/', express.static(__dirname + '/client'));

app.get('/api/vets', function(req, res) {
  if (app.locals.vetData) {
    res.status(200).send(app.locals.vetData);
  } else {
    request({
      method: 'GET',
      uri: app.locals.vetApi,
      headers: {
        'Accept': 'application/json'
      }
    }, function (err,resp,body){
      if (err) { 
        res.status(500).send('Internal Error'); 
        console.error(err);
      }

      app.locals.vetData = JSON.parse(body).d.results;

      res.status(200).send(app.locals.vetData);
    });
  }
});

module.exports = app;