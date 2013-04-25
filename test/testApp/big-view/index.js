var Chino = require('../../../'),
    SmallView = require('../small-view');

var BigView = module.exports = Chino.View({
  name: 'BigView',
  basePath: __dirname,
  template: 'big-view.jade'
});

BigView.extend({
  postRender: function() {
    var smallView = new SmallView({locationName: 'server'});
    this.$el.append(smallView.render());
  }
});
