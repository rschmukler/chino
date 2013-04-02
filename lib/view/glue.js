var Chino = require('../chino.js'),
        $ = require('dom');

module.exports = function() {
  $('[data-view-name]').forEach(function(el) {
    var viewName = $(el).attr('data-view-name');
    if(Chino.Views[viewName])
      var view = new Chino.Views[viewName]($(el));
  });
};
