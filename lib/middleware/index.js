var Batch = require('batch'),
    middlewares = [];


// Load those puppies
middlewares.forEach(function(middleware, index) {
  middlewares[index] = require(middleware);
});

module.exports = function(req, res, next) {
  var batch = new Batch();

  // Go go gadget serial
  batch.concurrency(1);

  middlewares.forEach(function(middleware) {
    batch.push(function(done) {
      middleware(req, res, done);
    });
  });

  batch.end(next);
};
