/*
 * This file implements a course search box, which handles searching for
 * courses. This uses an instant search box and connects to the Course Data
 * Manager to get the possible courses the user might be interested in.
 */

/*
 * Constructor takes the parent element of the view.
 * PARAM-TYPE: jQuery parent The parent element for the SearchBoxView.
 */
SearchBoxController = function(parent) {
  this.instantSearchBox_ = new SearchBoxView(parent, this);
  this.instantSearchBox_.render();
};


/*
 * The callback for handling input.
 * PARAM-TYPE: string input The current input.
 */
SearchBoxController.prototype.handleInput = function(input) {
  if (input.length == 0) {
    this.instantSearchBox_.clearResults();
    return;
  }
  var noNumbers = /^\D+$/;
  if (new RegExp(noNumbers).test(input)) {
    // They haven't typed numbers yet, we're checking departments.
    var deps = Department.thatStartWith(input);
    var results = [];
    for (var i = 0; i < deps.length; i++) {
      results.push({text: deps[i].short + ': ' + deps[i].long,
                    value: deps[i].short});
    }
    this.instantSearchBox_.setResults(results);
  } else {
    // They've started typing numbers, look for courses in that department.
    var letters = /^\D+/;
    var afterLetters = /\d.*$/;
    var dep = new RegExp(letters).exec(input)[0].trim().toUpperCase();
    var courseNumber = new RegExp(afterLetters).
                           exec(input)[0].trim().toUpperCase();
    var courses = CourseData.getCourseNamesForDepartmentByPrefix(dep,
                                                                 courseNumber);
    var results = [];
    for (var i = 0; i < courses.length; i++) {
      results.push({text: dep + ' ' + courses[i] + ': ' +
                           CourseData.getCourseName(dep, courses[i]),
                    value: dep + courses[i]});
    }
    this.instantSearchBox_.setResults(results);
  }
};


/*
 * The callback for handling a submit.
 * PARAM-TYPE: string input The current input.
 */
SearchBoxController.prototype.submitInput = function(input) {
  // TODO: Send out event or let some other thing know that a class has been
  // selected. (But only when it's a class, not just a department.)
  var noNumbers = /^\D+$/;
  if (new RegExp(noNumbers).test(input)) {
    // Do nothing (for now). They've just autocompleted the department.
  } else {
    alert("You've selected the class " + input);
    this.instantSearchBox_.clearInput();
  }
};
