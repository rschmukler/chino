
[![Build Status](https://travis-ci.org/rschmukler/chino.png?branch=master)](https://travis-ci.org/rschmukler/chino)

# chino

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

# License

  MIT
