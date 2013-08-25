/*
 * This file implements a course search box, which handles searching for
 * courses. This uses an instant search box and connects to the Course Data
 * Manager to get the possible courses the user might be interested in.
 */

/*
 * Nothing here yet!
 */
CourseSearchBox = function() {
  this.instantSearchBox_ = new InstantSearchBox(this,
                                                CourseSearchBox.INPUT_CLASS_,
                                                CourseSearchBox.RESULT_CLASS_);
};


/*
 * CSS Constants for styling.
 * @type string
 */
CourseSearchBox.INPUT_CLASS_ = 'course-search-input';
CourseSearchBox.RESULT_CLASS_ = 'course-search-result';


/*
 * Renders the internal search box.
 * @param Jquery parent The parent element of the search box.
 */
CourseSearchBox.prototype.render = function(parent) {
  this.instantSearchBox_.render(parent);
  this.instantSearchBox_.setPlaceholderText("Search for a class...");
};


/*
 * The callback for handling input.
 * @param string input The current input.
 */
CourseSearchBox.prototype.handleInput = function(input) {
  if (input.length == 0) {
    this.instantSearchBox_.clearResults();
    return;
  }
  var ch = input;
  this.instantSearchBox_.setResults([{text: ch + '161', value: 'CS161'},
                                     {text: ch + '140', value: 'CS140'},
                                     {text: ch + '144', value: 'CS144'}]);
};


/*
 * The callback for handling a submit.
 * @param string input The current input.
 */
CourseSearchBox.prototype.submitInput = function(input) {
  window.console.los('Submitted: ' + input);
};
