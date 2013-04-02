var express = require('express');
var app = module.exports = express(),
BigView = require('./big-view/big-view.js');
SmallView = require('./small-view/small-view.js');


app.get('/', function(req, res) {
  var bigView = new BigView({someVariable: "test", overWrittenVariable: "not-overwritten"});
  var smallView = new SmallView({locationName: 'server side'});
  res.end(bigView.render({overWrittenVariable: "OVERWRITTEN"}));
});

app.use(express.static(__dirname + '/build'));
