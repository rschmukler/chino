var DataStore = require('./data-store'),
    cheerio = require('cheerio');

var Middleware = module.exports = function(req, res, next) {
  res.renderChinoView = function(view, locals) {
    var $;

    if(Middleware.layoutPath) {
      renderPage(req, res, function(err, el) {
        if(err)
          return next(err);
        $ = el;
        $(Middleware.insertPoint).append(view.render(locals));
        $('head').prepend(dataStoreString());

        handlePostRender();
      });
    } else {
      $ = cheerio.load(view.render(locals));
      $('head').prepend(dataStoreString());
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

function dataStoreString() {
  return [
    "<script>",
    "window._chinoDataStore = " + JSON.stringify(DataStore.dump()) + ";",
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


