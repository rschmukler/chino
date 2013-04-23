var Chino = require('../chino.js');

var initViews = [];

module.exports = function() {
  var $ = Chino.View.engine;
  $('[data-view-name]').each(function(firstArg, secondArg) {
    var $el;

    if(typeof firstArg == 'number') {
        if(initViews.indexOf(secondArg) != -1) {
          return false;
        }
        $el = $(secondArg);
        initViews.push(secondArg);
    } else {
        if(initViews.indexOf(firstArg) != -1) {
          return false;
        }
        $el = $(firstArg);
        initViews.push(firstArg);
    }

    var viewName = $el.attr('data-view-name');

    if(Chino.Views[viewName]) {
      var view = new Chino.Views[viewName]($el);
      window.lastView = view;
    }
  });
};
