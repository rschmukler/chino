var View = require('./view');

var $ = View.engine;

var Middleware = module.exports = function(req, res, next) {
  res.renderChinoView = function(view, locals) {
    var rendered = view.render(locals);
    var $el = $(Middleware.insertPoint);
    $el.html('');

    for(var i = 0; i < rendered.length; ++i)
      $el.append(rendered[i]);
  };
  next();
};
