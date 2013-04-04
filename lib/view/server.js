jade = require('jade'),
extend = require('extend'),
cheerio = require('cheerio');

module.exports = function(ChinoView) {

  ChinoView._readTemplate = function() {
    var fs = require('fs'),
    read = fs.readFileSync;
    var template = read(this._filePath(), 'utf-8');
    var options = {};
    options.filename = this._filePath();

    this._renderer = jade.compile(template, options);
  };

  ChinoView.prototype.renderTemplate = function(locals) {
    if(process.env.environment == 'development') {
      this.View._readTemplate();
    }

    var variables = extend({view: this}, this.locals, locals);
    this.$el = cheerio.load(this.View._renderer(variables)).root().children().first();
    this._postRenderTemplate();
    return this.toHTML();
  };

  ChinoView.prototype.toHTML = function() {
    return this.$el.parent().html();
  };
};
