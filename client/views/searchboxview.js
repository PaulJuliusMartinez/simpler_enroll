/*
 * A file for an instant search box.
 */

/*
 * Constructor takes:
 * PARAM-TYPE: jQuery parent The parent element of the view.
 * PARAM-TYPE: SearchBoxController controller The controller of the view.
 */
SearchBoxView = function(parent, controller) {
  // TYPE: jQuery
  this.parent_ = parent;
  // TYPE: SearchBoxController
  this.controller_ = controller;
};



// TYPE: Jquery The input box for the search box.
SearchBoxView.prototype.input_ = null;

// TYPE: Jquery The div that will contain the result elements.
SearchBoxView.prototype.elements_ = null;

// TYPE: number The currently selected element;
SearchBoxView.prototype.currentSelected_ = -1;

/*
 * Renders the search box into the DOM.
 * PARAM-TYPE: Jquery parent The parent element for the search bar.
 */
SearchBoxView.prototype.render = function() {
  this.parent_.addClass(SearchBoxView.CONTAINER);
  this.input_ = $('<input>').addClass(SearchBoxView.INPUT_CLASS);
  this.input_.attr('placeholder', 'Search for a class...');
  this.elements_ = $('<div>').addClass(SearchBoxView.ELEMENTS);
  this.parent_.append(this.input_).
                  append(this.elements_);

  // Add listeners
  var view = this;
  this.input_.bind('input', function() {
    view.controller_.handleInput(view.input_.val());
  });

  this.input_.bind('focus', function() {
    view.showResults();
  });

  // We need a micro-second timeout to make sure that this isn't hid until after
  // the click is processed.
  this.input_.bind('blur', function() {
    setTimeout(function() { view.hideResults(); }, 1);
  });

  this.input_.keydown(function(e) {
    view.handleKeyPress_(e);
  });
};

/*
 * Shows the results.
 */
SearchBoxView.prototype.showResults = function() {
  this.elements_.show();
};

/*
 * Hides the results.
 */
SearchBoxView.prototype.hideResults = function() {
  this.elements_.hide();
};

/*
 * Clears the input.
 */
SearchBoxView.prototype.clearInput = function() {
  this.input_.val('');
};

/*
 * Clears the results.
 */
SearchBoxView.prototype.clearResults = function() {
  this.elements_.html('');
  this.currentSelected_ = -1;
};

/*
 * Clears the results and takes every string passes in and adds it as a result.
 * PARAM-TYPE: string[] results An array of result strings.
 */
SearchBoxView.prototype.setResults = function(results) {
  this.clearResults();
  // This is fine. Maybe remove?
  //if (results.length == 0) return; // Don't show a single result.
  var view = this;
  for (var i = 0; i < results.length; i++) {
    var element = $('<div>').addClass(SearchBoxView.RESULT_CLASS).
                             data('index', i).
                             data('value', results[i].value).
                             html(results[i].text);
    if (i == 0) element.addClass(SearchBoxView.FIRST);
    if (i == results.length - 1) element.addClass(SearchBoxView.LAST);
    element.mousedown(function() {
      view.submitValue($(this).data('value'));
    });
    this.elements_.append(element);
  }
};


/*
 * Select one of the results if the user hits the arrow keys. If the user hits
 * enter, call the submitInput callback. Otherwise do nothing.
 * PARAM-TYPE: Event event The keydown event.
 */
SearchBoxView.prototype.handleKeyPress_ = function(e) {
  var keyCode = e.keyCode || e.which;
  var arrow = {up: 38, down: 40};
  var enter = 13;
  var tab = 9;

  switch (keyCode) {
    case arrow.up:
      if (this.currentSelected_ > -1) {
        this.currentSelected_--;
        this.highlightSelected_();
      }
      e.preventDefault();
      break;
    case arrow.down:
      if (this.currentSelected_ < this.elements_.children().length - 1) {
        this.currentSelected_++;
        this.highlightSelected_();
      }
      e.preventDefault();
      break;
    case tab:
    case enter:
      this.submitValue(this.getSelected_());
      e.preventDefault();
      break;
  }
};


/*
 * Submit a certain value, set the input field and clear the results.
 * PARAM-TYPE: string value The value to be submitted.
 */
SearchBoxView.prototype.submitValue = function(value) {
  this.input_.val(value);
  this.controller_.submitInput(value);
  this.clearResults();
};


/*
 * Set the current selected results.
 */
SearchBoxView.prototype.highlightSelected_ = function() {
  this.elements_.children().removeClass(SearchBoxView.SELECTED);
  // .children()[i] returns a DOM element, so I have to wrap
  // it up in JQuery again.
  $(this.elements_.children()[this.currentSelected_]).
      addClass(SearchBoxView.SELECTED);
};


/*
 * Gets the currently selected result.
 */
SearchBoxView.prototype.getSelected_ = function() {
  if (this.currentSelected_ == -1) {
    return this.input_.val();
  } else {
    return $(this.elements_.children()[this.currentSelected_]).data('value');
  }
};

/*
 * Constants for the CSS attributes on the elements
 * TYPE: string
 */
SearchBoxView.CONTAINER = 'search-box-container';
SearchBoxView.INPUT_CLASS = 'search-box-input';
SearchBoxView.ELEMENTS = 'search-box-elements';
SearchBoxView.RESULT_CLASS = 'search-box-result';
SearchBoxView.FIRST = 'search-box-result-first';
SearchBoxView.LAST = 'search-box-result-last';
SearchBoxView.SELECTED = 'search-box-result-selected';
