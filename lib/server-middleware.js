var cheerio = require('cheerio'),
    dataStore = require('./data-store');

var Middleware = module.exports = function(req, res, next) {
  var ds = dataStore();
  req.ChinoDataStore = ds;

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

        handlePostRender();
      });
    } else {
      $ = cheerio.load(view.render(locals));
      handlePostRender();
    }

    function handlePostRender() {
      if(Middleware.postRender) {
        if(Middleware.postRender.length == 5) {
          return Middleware.postRender($, req, res, view, function() {
            $('head').prepend(dataStoreString(ds));
            res.send($.html());
          });
        } else {
          Middleware.postRender($, req, res, view);
          $('head').prepend(dataStoreString(ds));
        }
      } else {
        $('head').prepend(dataStoreString(ds));
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
  try {
    return [
      "<script>",
      "window._chinoDataStore = " + JSON.stringify(ds.dump()) + ";",
    "</script>"].join("\n");
  } catch(err) {
    debugger;
  }
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


