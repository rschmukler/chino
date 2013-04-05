var Chino = require('../chino.js');

module.exports = function() {
  var $ = Chino.View.engine;
  $('[data-view-name]').each(function(firstArg, secondArg) {
    var $el;

    if(typeof firstArg == 'number') {
        $el = $(secondArg);
    } else {
        $el = $(firstArg);
    }

    var viewName = $el.attr('data-view-name');

    if(Chino.Views[viewName]) {
      var view = new Chino.Views[viewName]($el);
      window.lastView = view;
    }
  });
};
