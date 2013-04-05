var testApp = require('./testApp'),
    BigView = require('./testApp/big-view'),
    expect = require('expect.js'),
    zombie = require('zombie'),
    Chino = require('../'),
    browser;

before(function() {
  testApp = testApp.listen(12345);
  browser = new zombie({site: 'http://localhost:12345'});
});

after(function() {
  testApp.close();
});


describe("Middleware", function() {

});

describe("API", function() {
  describe("#use", function() {
    it("passes Chino to the plugin", function() {
      var specFunction = function(passed) {
        expect(passed).to.be(Chino);
      };
      Chino.use(specFunction);
    });
  });
});

describe("Creating Views", function() {
  it("sets hidden properties from object", function() {
    var SomeView = Chino.View({name: 'SomeView', basePath: __dirname + '/testApp/big-view' , template: 'big-view.jade'});
    expect(SomeView).to.have.property('_name', 'SomeView');
    expect(SomeView).to.have.property('_basePath', __dirname + '/testApp/big-view');
    expect(SomeView).to.have.property('_template', 'big-view.jade');
  });
});

describe("View Behavior", function() {
  it("calls initialize on a view", function() {
    var called = false, b;

    BigView.prototype.initialize = function() { called = true; };
    b = new BigView();
    b.render({someVariable: 'I like turtles', overWrittenVariable: 'Pie'});
    expect(called).to.be(true);
    BigView.prototype.initialize = undefined;
  });

  it("can be extended", function() {
    var called = false, b;
    BigView.extend({initialize: function() { called = true; }});
    b = new BigView();
    b.render({someVariable: 'I like turtles', overWrittenVariable: 'Pie'});
    expect(called).to.be(true);
  });
});

describe("Server Side", function() {
  before(function(done) { browser.visit('/', done); });

  describe("Rendering", function() {
    it("jade templates", function() {
      expect(browser.text('h1')).to.match(/This is a/);
    });

    it("variables", function() {
      expect(browser.text('h1')).to.match(/test/);
    });

    it("allows overwriting of variables", function() {
      expect(browser.text('h3')).to.match(/OVERWRITTEN/);
    });

    it("data-locals attribute", function() {
      expect(browser.query('[data-locals]')).to.be.ok();
    });

    it("data-view-name attribute", function() {
      expect(browser.query('[data-view-name]')).to.be.ok();
    });
  });
});

describe("Client Side", function() {
  beforeEach(function(done) { browser.visit('/', done); });
  describe("Rendering", function() {
    it("jade templates", function() {
      expect(browser.text('a')).to.match(/This was rendered as a small view from the/);
    });
    it("variables", function() {
      expect(browser.text('a')).to.match(/client/);
    });
  });

  it("uses setEvents", function(done) {
    browser.clickLink("This was rendered as a small view from the client", function() {
      expect(browser.queryAll(".active")).to.have.length(1);
      done();
    });
  });
});

describe("Glue", function() {
  it("registers client side views for server rendered templates", function(done) {
    browser.clickLink("This was rendered as a small view from the server", function() {
      expect(browser.queryAll(".active")).to.have.length(1);
      done();
    });
  });
});
