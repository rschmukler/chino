var Chino = (typeof process == 'undefined') ? window.require('chino') : require('chino');

var path = Chino.isBrowser ? 'small-view' : __dirname;

var SmallView = module.exports = Chino.View({
  name: 'SmallView',
  basePath: path,
  template: 'small-view.jade'
});

SmallView.prototype.setEvents = function() {
  this.$el.on('click', this.toggleClass.bind(this));
};

SmallView.prototype.toggleClass = function() {
  this.$el.toggleClass('active');
};

