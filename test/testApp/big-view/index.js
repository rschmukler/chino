var Chino = require('../../../'),
    SmallView = require('../small-view');

var BigView = module.exports = Chino.View.extend({
  name: 'BigView',
  basePath: __dirname,
  template: 'big-view.jade',
  postRender: function() {
    var smallView = new SmallView({locationName: 'server'});
    this.$el.append(smallView.render());
  }
});
