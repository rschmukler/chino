var Chino = require('../chino.js'),
        $ = require('dom');

module.exports = function() {
  $('[data-view-name]').forEach(function(el) {
    var viewName = $(el).attr('data-view-name');
    var view = new Chino.Views[viewName]($(el));
  });
};
