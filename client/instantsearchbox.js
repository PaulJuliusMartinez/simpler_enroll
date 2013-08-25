/*
 * A file for an instant search box. This is implmented via an input handler and
 * a callback that is called on every input.
 */

/*
 * Constructor takes:
 * @param Function handleInput A function(string) that is called whenever the
 *     input changes. The argument is the current input.
 * @param Function submitInput A function(string) that is called whenever the
 *     user hits enter.
 * @param string searchClass A CSS class to apply to the search bar.
 * @param string searchID An ID to apply to the search bar.
 * @param string resultClass A CSS class to apply to the results. These will
 *     be standard <div> elements. The first and last results will also have the
 *     classes 'search-result-first' and 'search-result-last' respectively.
 */
InstantSearchBox = function(
    handleInput, submitInput, searchClass, searchID, resultClass) {
  this.inputCallback_ = handleInput;
  this.submitCallback_ = submitInput;
  this.searchClass_ = searchClass;
  this.searchID_ = searchID;
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
  this.input_ = $('<input>').addClass(this.searchClass_)
                          .attr('id', this.searchID_);
  this.elements_ = $('<div>').css('position', 'absolute');
  this.container_.append(this.input_).
                  append(this.elements_);
  parent.append(this.container_);

  // Add listeners
  var instantSearch = this;
  this.input_.bind('input', function() {
    instantSearch.handleInput_();
  });

  this.input_.bind('focus', function() {
    instantSearch.showResults();
  });

  this.input_.bind('blur', function() {
    instantSearch.hideResults();
  });

  this.input_.bind('submit', function() {
    instantSearch.submit_();
  });

  this.input_.keydown(instantSearch.selectResult_);
};


/*
 * Called when the input changes. Calls inputCallback.
 */
InstantSearchBox.prototype.handleInput_ = function() {
  this.inputCallback_(this.input_.value);
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
 * Clears the results.
 */
InstantSearchBox.prototype.clearResults = function() {
  this.elements_.html('');
};


/*
 * Clears the results and takes every string passes in and adds it as a result.
 * @param string[] results An array of result strings.
 */
InstantSearchBox.prototype.setResults = function(results) {
  this.clearResults();
  for (var i = 0; i < results.length; i++) {
    var element = $('<div>').addClass(this.resultClass_);
    if (i == 0) element.addClass(InstantSearchBox.FIRST_);
    if (i == results.length - 1) element.addClass(InstantSearchBox.LAST_);
    this.elements_.append(element);
  }
};


/*
 * Select one of the results if the user hits the arrow keys. If the user hits
 * enter, call the submitInput callback. Otherwise do nothing.
 * @param Event event The keydown event.
 */
InstantSearchBox.prototype.selectResult_ = function(e) {
  var keyCode = e.keyCode || e.which;
  var arrow = {up: 38, down: 40};
  var enter = 13;

  switch (keyCode) {
    case arrow.up:
      if (this.currentSelected_ > -1) {
        this.currentSelected_--;
        this.highlightSelected_();
      }
      break;
    case arrow.down:
      if (this.currentSelected_ < this.elements_.children().length) {
        this.currentSelected_++;
        this.highlightSelected_();
      }
      break;
    case enter:
      this.submitCallback(this.input_.value);
      break;
  }
  e.preventDefault();
};


/*
 * Set the current selected results.
 */
InstantSearchBox.prototype.highlightSelected_ = function() {
  this.elements_.children().removeClass(InstantSearchBox.SELECTED_);
  this.elements_.children()[this.currentSelected_].
      addClass(InstantSearchBox.SELECTED_);
};
