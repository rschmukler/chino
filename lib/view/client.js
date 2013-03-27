dom = require('dom');

module.exports = function(ChinoView) {
  ChinoView._readTemplate = function() {
    var template = this._filePath().replace(/\.jade/, '.js');
    this._renderer = require(template);
  };

  ChinoView.prototype.renderTemplate = function(locals) {
    this.$el = dom(this.View._renderer(extend({view: this}, this.locals, locals)));
    return this.$el.selector;
  };
};
