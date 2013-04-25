# chino

[![Build Status](https://travis-ci.org/rschmukler/chino.png?branch=master)](https://travis-ci.org/rschmukler/chino)

Jade based views that render server and client side

# Installation

    $ component install rschmukler/chino
    $ npm install chino

# API

## Defining Views

There are two ways to define new views in `Chino`. 

### Chino.View(name, path-to-templates, options)

This method requires all essential variables to be passed in as arguments.

    var Chino = require('chino');

    var path = (Chino.isBrowser ? 'todo-item' : __dirname);

    var TodoItem = Chino.View('TodoItem', path, {template: 'todo-item.jade'});

### Chino.View(baseObject)

This method requires an object that will be extended to create the view
template. Required properties for this object are: `_name`, `_basePath`, and
`_template`

    var Chino = require('chino');
    var path = (Chino.isBrowser ? 'todo-item-view' : __dirname);

    var TodoItemView = module.exports = Chino.View({
      name: 'TodoItem',
      basePath: path,
      template: 'todo-item.jade'
    })

### Specials

Specials are objects that, when given JSON, should be instantiated with the JSON
as an argument to the constructor. The local variable will then be overwritten.
This is helpful for `gluing` the views (see below), as it lets client side views
instantiate full fledged instances of objects with just JSON being passed in.

You should pass in a `key-value object` where `key` is the name of the attribute
in `locals` and `value` is the object to use for constructing.

Specials can either be set directly, or as part of the `baseObject` passed to
`Chino.View`.

    var Chino = require('chino'),
        Todo = require('todo-model');

    var TodoItemView = Chino.View({
      name: 'TodoItem',
      basePath: path,
      template: 'todo-item.jade',
      specials: {
        'todo': Todo
      }
    }

    TodoItemView._specials['nextTodo'] = Todo;

    var validTodoJSON = { title: "Take out garbage",
                          dueDate: new Date() };

    var todoItemView = new TodoItemView({todo: validTodoJSON});

    todoItemView.locals.todo instanceof Todo == true; // Returns true, used the JSON to construct a new Todo instance


## Instantiating Views

Once you've defined a view, you can create instances of it. 

## View( [locals] )

    var TodoItemView = require('todo-item-view');

    var todoView = new TodoItemView({message: "Take out trash", dueDate: new Date() });

    console.log(todoView.locals.message);
    => Take out trash


## View Instance Methods/Properties


### $el

`$el` is exposed to represent a jQuery-like object that is provided by either
[matthewmueller/cheerio](http://github.com/matthewmuller/cheerio) or
[component/dom](http://github.com/component/dom).

    var TodoListView = require('todo-list-view'),
        todoList = new TodoListView(),
        todos = ['eat', 'write code', 'sleep'];

    todos.forEach(function(todo) {
      todoList.$el.find('ul').append('<li>' + todo + '</li>');
    });

### initialize()

`initialize` is called after a view has been instantiated. At this point,
`locals` have been set and `setEvents` has been called. This is a good place to
add any code needed before rendering happens (such as setting default values).

### locals

`locals` is an object of all the variables to expose to the template and a place
to store objects/data related to the view.


### render( [overWrittenLocals] )

By default this calls `renderTemplate` and then calls `postRender`.

This method should return the HTML of the element (generally by calling
`toHTML()` and sets `$el` to a jQuery-like object. Typically it calls `renderTemplate`
which would render the template.

`overWrittenLocals` will be passed into the view and _temporarily_ overwrite the
values of `locals`

### renderTemplate( [overWrittenLocals] )

Returns the HTML of the rendered template and sets a jQuery-like object for `$el`.
`overWrittenLocals` will be passed into the view and _temporarily_ overwrite the
values of `locals`. `view` will also be exposed to the template, pointing to the
instance of the `Chino View`.

### postRender()

This should be called after `render`. Useful for processing `$el` after the
template has been rendered.

    TodoItemView.extend({
      postRender: function() {
        var day = 1000 * 60 * 60 * 24;

        if(this.locals.todo.dueDate < (new Date() - day))
          this.$el.addClass('dueSoon');
      }
    });

### setEvents()

`setEvents` is called `client` side and attaches event listeners. Generally you
should only listen to events on elements within your `Chino.View` and not the
`DOM` on the whole.

    var TodoItemView = module.exports = Chino.View({
      name: 'TodoItem',
      basePath: path,
      template: 'todo-item.jade'
    });

    TodoItemView.extend({
      setEvents: function() {
        this.$el.on('click', 'input[type=checkbox]', this.toggleDone.bind(this));
      },

      toggleDone: function() {
        this.$el.toggleClass('done');
      }
    });

## Gluing Views

After you have defined your views, you can use `Chino.ready` to apply Chino's
glue. Chino's glue will find views rendered server side and instantiate client
side equivalents with the appropriate DOM elements. This means that you can
define events for views rendered server side and have them apply client side.


## Using the DataStore

To avoid creating multiple instances of what should be the same object, Chino
uses `Chino.DataStore` which intelligently maps the "same" objects to the same
location in the `Chino.DataStore`. `Chino.DataStore` can then be dumped out client side to
create instances of the objects.

If you want to manipulate the `Chino.DataStore` directly you may do so with the
following methods:

### .addObject(obj)

Adds the object to `Chino.DataStore` and returns the `lookupId` to get it out with.

If it can auto-determine the `lookupId` of the object (more on this below) it will use
it. Otherwise it will randomly generate an `lookupId` instead.

### .get(lookupId)

Returns the object from `Chino.DataStore`. If the object cannot be found, it
returns `null` instead.

### .addLookupIdMethod(str)

Informs Chino on additional ways to attempt to auto-resolve the `lookupId` of the
object.

    var article = { title: "This is a catchy article",
                    description: "This is some content which you shou...",
                    slug: 'this-is-a-catchy-article' };

    Chino.DataStore.addLookupIdMethod('slug');

    var lookupId = Chino.DataStore.addObject(article);

    console.log(lookupId);
     => this-is-a-catchy-article

### .dump()

Returns the contents of the `DataStore`. Useful for Middleware to expose it to
the client. See below.

## Middleware

By default, Chino includes some Middleware to aid developing express
applications.

The middleware exposes one method, `res.renderChinoView`. This method behaves
differently depending on how you configure the Middleware.

### Configuring a layout

#### Setting the file

If you want a jade template to render as the layout of the application, without
any `Chino.View` associated with it.

    Chino.Middleware.layoutPath = '/some/path/to/file';

From then on, any `Chino.View` rendered with `res.renderChinoView` will be
inserted in the `body` element.

#### Set where the view gets inserted

If you'd rather it gets inserted elsewhere you can configure
`Chino.Middleware.insertPoint` with a CSS querystring for where you'd like it.

    Chino.Middleware.insertPoint = '#app-content';

#### Passing additional variables into the template.

Sometimes you need additional variables for your template to be rendered. You
can define that by setting `Chino.Middleware.exposeVariables`

    Chino.Middleware.exposeVariables = function(req, res) {
      return {
        errorMessage: req.flash('error'),
        infoMessage:  req.flash('info'),
        signedIn:     res.user != undefined
      }
    };

### Manipulating the DOM after render 

If you need to manipulate the DOM after the Middleware is done rendering the
view and DataStore.

To do that, you can specify `Chino.Middleware.postRender`.

    Chino.Middleware.postRender = function($, req, res) {
      $('head').prepend("<script>alert("Hello World")</script>");
    };

Additionally, you can also make `Chino.Middleware.postRender` work with async
operations by specifying a fourth argument, `done` and calling it.

    Chino.Middleware.postRender = function($, req, res, done) {
      setTimeout(function() {
        $('head').prepend("<script>alert("Hello World")</script>");
        done();
      }, 500);
    };

# License

  MIT
