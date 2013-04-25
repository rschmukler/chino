var express = require('express');
    app = module.exports = express(),
  Chino = require('../../'),
BigView = require('./big-view');

app.use(Chino.Middleware);


app.get('/', function(req, res) {
  var bigView = new BigView({someVariable: "test", overwrittenVariable: "not-overwritten"});
  res.renderChinoView(bigView, {overwrittenVariable: "OVERWRITTEN"});
});

app.use(express.static(__dirname + '/build'));
