var testApp = require('./testApp'),
    BigView = require('./testApp/big-view'),
    expect = require('expect.js'),
    WebDriver = require('selenium-webdriver'),
    Chino = require('../'),
    By = WebDriver.By,
    spawn = require('child_process').spawn,
    browser, server;


describe("Chino", function() {
  before(function() {
    server = testApp.listen(12345);
    browser = new WebDriver.Builder().usingServer('http://localhost:8080').withCapabilities({browserName: 'phantomjs'}).build();
  });

  after(function(done) {
    browser.close();
    server.close(done);
  });

  describe("Middleware", function() {
    it("passes along the data to init the DataStore", function(done) {
      var DataStore = Chino.DataStore();
      var dataObject = { someProperty: "HelloWorld!" };

      browser.get('http://localhost:12345/');

      browser.executeScript(function() {
        return data = window.Chino.DataStore.dump();
      }).then(function(result) {
        expect(result).to.not.be.empty();
        done();
      });
    });

    describe(".exposeVariables", function() {
      it("returns an empty object", function() {
        expect(Chino.Middleware.exposeVariables()).to.be.empty();
      });
    });
  });

  describe("Data Store", function() {
    var DataStore = Chino.DataStore();
    describe("addLookupIdMethod", function() {
      it("adds a way to lookup the id of an object", function() {
        DataStore.addLookupIdMethod('slug');
        var obj = {slug: 'i-like-turtles', title: "Turtles attacking New York" };
        expect(DataStore.addObject(obj)).to.be(obj.slug);
      });
    });

    describe(".dump", function() {
      it("returns a object representation of the data store", function() {
        var obj = { title: "Some title" },
            id = DataStore.addObject(obj);

        expect(DataStore.dump()).to.have.property(id, obj);
      });
    });

    describe(".addObject", function() {
      it("returns the lookup id of the object", function() {
        var obj = { id: 1, title: "Yippie!" };
        expect(DataStore.addObject(obj)).to.be.ok();
      });

      it("generates an id if it doesn't already have one", function() {
        var obj = { title: "Yippie" };
        expect(DataStore.addObject(obj)).to.be.a('string');
      });
    });

    describe(".get", function() {
      var obj, lookupId;
      before(function() {
        obj = { title: "this is a test", somethingElse: true };
        lookupId = DataStore.addObject(obj);
      });

      it("returns the object from the datastore", function() {
        expect(DataStore.get(lookupId)).to.be(obj);
      });

      it("returns null if the object doesn't exist", function() {
        expect(DataStore.get("sfadjadfslkj")).to.be(null);
      });
    });
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
      b.render({someVariable: 'I like turtles', overwrittenVariable: 'Pie'});
      expect(called).to.be(true);
      BigView.prototype.initialize = undefined;
    });

    it("can be extended", function() {
      var called = false, b;
      BigView.extend({initialize: function() { called = true; }});
      b = new BigView();
      b.render({someVariable: 'I like turtles', overwrittenVariable: 'Pie'});
      expect(called).to.be(true);
    });
  });

  describe("Server Side", function() {
    before(function() { browser.get('http://localhost:12345/'); });

    describe("Rendering", function() {
      it("jade templates", function(done) {
        browser.findElement(By.css('h1')).getText().then(function(text) {
          expect(text).to.match(/This is a/);
          done();
        });
      });

      it("variables", function(done) {
        browser.findElement(By.css('h1')).getText().then(function(text) {
          expect(text).to.match(/test/);
          done();
        });
      });

      it("allows overwriting of variables", function(done) {
        browser.findElement(By.css('h3')).getText().then(function(text) {
          expect(text).to.match(/OVERWRITTEN/);
          done();
        });
      });

      it("data-locals attribute", function(done) {
        browser.findElements(By.css('[data-locals]')).then(function(els) {
          expect(els).to.be.ok();
          done();
        });
      });

      it("data-view-name attribute", function(done) {
        browser.findElements(By.css('[data-view-name]')).then(function(els) {
          expect(els).to.be.ok();
          done();
        });
      });
    });
  });

  describe("Client Side", function() {
    beforeEach(function() { browser.get('http://localhost:12345/'); });

    describe("Rendering", function() {
      it("jade templates", function(done) {
        browser.findElement(By.css('a')).getText().then(function(text) {
          expect(text).to.match(/This was rendered as a small view from the/);
          done();
        });
      });

      it("variables", function(done) {
        browser.findElement(By.css('a:last-of-type')).getText().then(function(text) {
          expect(text).to.match(/client/);
          done();
        });
      });
    });

    it("uses setEvents", function(done) {
      browser.findElement(By.linkText("This was rendered as a small view from the client")).click();
      browser.findElements(By.css('.active')).then(function(els) {
        expect(els).to.have.length(1);
        done();
      });
    });
  });

  describe("Glue", function() {
    it("registers client side views for server rendered templates", function(done) {
      browser.get('http://localhost:12345/');
      browser.findElement(By.linkText("This was rendered as a small view from the server")).click();
      browser.findElements(By.css('.active')).then(function(els) {
        expect(els).to.have.length(1);
        done();
      });
    });
  });
});
