var cheerio = require('cheerio'),
    dataStore = require('./data-store');

var Middleware = module.exports = function(req, res, next) {
  var ds = dataStore();

  for(var i = 0; i < Middleware.lookupMethods.length; ++i) {
    ds.addLookupIdMethod(Middleware.lookupMethods[i]);
  }

  res.renderChinoView = function(view, locals) {
    view._ds = ds;
    var $;

    if(Middleware.layoutPath) {
      renderPage(req, res, function(err, el) {
        if(err)
          return next(err);
        $ = el;
        $(Middleware.insertPoint).append(view.render(locals));
        $('head').prepend(dataStoreString(ds));

        handlePostRender();
      });
    } else {
      $ = cheerio.load(view.render(locals));
      $('head').prepend(dataStoreString(ds));
      handlePostRender();
    }

    function handlePostRender() {
      if(Middleware.postRender) {
        if(Middleware.postRender.length == 5) {
          return Middleware.postRender($, req, res, view, function() {
            res.send($.html());
          });
        } else {
          Middleware.postRender($, req, res, view);
        }
      }

      res.send($.html());
    }
  };

  next();
};

Middleware.layoutPath = undefined;
Middleware.postRender = undefined;
Middleware.insertPoint = 'body';

function dataStoreString(ds) {
  return [
    "<script>",
    "window._chinoDataStore = " + JSON.stringify(ds.dump()) + ";",
  "</script>"].join("\n");
}

function renderPage(req, res, cb) {
  res.render(Middleware.layoutPath, Middleware.exposeVariables(req, res), function(err, str) {
    var $el = cheerio.load(str);
    cb(err, $el);
  });
}

Middleware.exposeVariables = function(req, res) {
  return {};
};

Middleware.lookupMethods = [];


