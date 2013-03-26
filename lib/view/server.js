jade = require('jade'),
extend = require('extend'),
cheerio = require('cheerio');

module.exports = function(ChinoView) {
  ChinoView._filePath = function() {
    return this._basePath + '/' + this._template;
  };

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

    this.$el = cheerio.load(this.View._renderer(extend({view: this}, this.locals, locals))).root();
    return this.$el.html();
  };

  ChinoView.prototype.render = function(locals) {
    return this.renderTemplate();
  };
};
