/*
 * A file for an instant search box. This is implmented via an input handler and
 * a callback that is called on every input.
 */

/*
 * Constructor takes:
 * @param Object searchHandler An object that responds to the methods
 *     handleInput(string) and submitInput(string);
 * @param string inputClass A CSS class to apply to the search bar.
 * @param string resultClass A CSS class to apply to the results. These will
 *     be standard <div> elements. The first and last results will also have the
 *     classes 'search-result-first' and 'search-result-last' respectively.
 */
InstantSearchBox = function(searchHandler, inputClass, resultClass) {
  this.searchHandler_ = searchHandler;
  this.inputClass_ = inputClass;
  this.resultClass_ = resultClass;
};


/*
 * @type Jquery The div containing the input box and the other results.
 */
InstantSearchBox.prototype.container_ = null;


/*
 * @type Jquery The input box for the search box.
 */
InstantSearchBox.prototype.input_ = null;


/*
 * @type Jquery The div that will contain the result elements.
 */
InstantSearchBox.prototype.elements_ = null;


/*
 * @type number The currently selected element;
 */
InstantSearchBox.prototype.currentSelected_ = -1;


/*
 * Constants for the CSS attributes on the elements
 * @type string
 */
InstantSearchBox.FIRST_ = 'search-result-first';
InstantSearchBox.LAST_ = 'search-result-last';
InstantSearchBox.SELECTED_ = 'search-result-selected';


/*
 * Renders the search box into the DOM.
 * @param Jquery parent The parent element for the search bar.
 */
InstantSearchBox.prototype.render = function(parent) {
  // Build DOM
  this.container_ = $('<div>').css('position', 'relative');
  this.input_ = $('<input>').addClass(this.inputClass_);
  this.elements_ = $('<div>').css('position', 'absolute');
  this.container_.append(this.input_).
                  append(this.elements_);
  parent.append(this.container_);

  // Add listeners
  var instantSearch = this;
  this.input_.bind('input', function() {
    instantSearch.searchHandler_.handleInput(instantSearch.input_.val());
  });

  this.input_.bind('focus', function() {
    instantSearch.showResults();
  });

  // We need a micro-second timeout to make sure that this isn't hid until after
  // the click is processed.
  this.input_.bind('blur', function() {
    setTimeout(function() { instantSearch.hideResults(); }, 1);
  });

  this.input_.keydown(function(e) {
    instantSearch.handleKeyPress_(e);
  });
};


/*
 * Sets the placeholder text of the input.
 * @param string str The place holder text.
 */
InstantSearchBox.prototype.setPlaceholderText = function(str) {
  this.input_.attr('placeholder', str);
};


/*
 * Shows the results.
 */
InstantSearchBox.prototype.showResults = function() {
  this.elements_.show();
};


/*
 * Hides the results.
 */
InstantSearchBox.prototype.hideResults = function() {
  this.elements_.hide();
};


/*
 * Clears the input.
 */
InstantSearchBox.prototype.clearInput = function() {
  this.input_.val('');
};


/*
 * Clears the results.
 */
InstantSearchBox.prototype.clearResults = function() {
  this.elements_.html('');
  this.currentSelected_ = -1;
};


/*
 * Clears the results and takes every string passes in and adds it as a result.
 * @param string[] results An array of result strings.
 */
InstantSearchBox.prototype.setResults = function(results) {
  this.clearResults();
  if (results.length == 0) return; // Don't show a single result.
  var instantSearch = this;
  for (var i = 0; i < results.length; i++) {
    var element = $('<div>').addClass(this.resultClass_).
                             data('index', i).
                             data('value', results[i].value).
                             css('position', 'relative').
                             text(results[i].text);
    if (i == 0) element.addClass(InstantSearchBox.FIRST_);
    if (i == results.length - 1) element.addClass(InstantSearchBox.LAST_);
    element.mousedown(function() {
      instantSearch.submitValue($(this).data('value'));
    });
    this.elements_.append(element);
  }
};


/*
 * Select one of the results if the user hits the arrow keys. If the user hits
 * enter, call the submitInput callback. Otherwise do nothing.
 * @param Event event The keydown event.
 */
InstantSearchBox.prototype.handleKeyPress_ = function(e) {
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
 * @param string value The value to be submitted.
 */
InstantSearchBox.prototype.submitValue = function(value) {
  this.input_.val(value);
  this.searchHandler_.submitInput(value);
  this.clearResults();
};


/*
 * Set the current selected results.
 */
InstantSearchBox.prototype.highlightSelected_ = function() {
  this.elements_.children().removeClass(InstantSearchBox.SELECTED_);
  // I'm not sure why .children()[i] returns a DOM element, but I have to wrap
  // it up in JQuery again.
  $(this.elements_.children()[this.currentSelected_]).
      addClass(InstantSearchBox.SELECTED_);
};


/*
 * Gets the currently selected result.
 */
InstantSearchBox.prototype.getSelected_ = function() {
  if (this.currentSelected_ == -1) {
    return this.input_.val();
  } else {
    return $(this.elements_.children()[this.currentSelected_]).data('value');
  }
};
