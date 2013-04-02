var express = require('express');
    app = module.exports = express(),
  Chino = require('../../'),
BigView = require('./big-view'),
SmallView = require('./small-view');


app.get('/', function(req, res) {
  var bigView = new BigView({someVariable: "test", overWrittenVariable: "not-overwritten"});
  var smallView = new SmallView({locationName: 'server'});
  res.end(bigView.render({overWrittenVariable: "OVERWRITTEN"}) + smallView.render());
});

app.use(express.static(__dirname + '/build'));
