/*
 * This file implements a course search box, which handles searching for
 * courses. This uses an instant search box and connects to the Course Data
 * Manager to get the possible courses the user might be interested in.
 */

/*
 * Constructor takes the parent element of the view.
 * PARAM-TYPE: jQuery parent The parent element for the SearchBoxView.
 * PARAM-TYPE: MainController manager The controller that manages this one.
 */
SearchBoxController = function(parent, manager) {
  // TYPE: SearchBoxView
  this.view_ = new SearchBoxView(parent, this);
  this.view_.render();
  // TYPE: MainController
  this.manager_ = manager;
};


/*
 * The callback for handling input.
 * PARAM-TYPE: string input The current input.
 */
SearchBoxController.prototype.handleInput = function(input) {
  if (input.length == 0) {
    this.view_.clearResults();
    return;
  }
  var match = CourseData.REGEXP.exec(input);
  var dep = match[1].trim().toUpperCase();
  var num = match[2].trim().toUpperCase();
  if (num == '') {
    // They haven't typed numbers yet, we're checking departments.
    var deps = Department.thatStartWith(input);
    var results = [];
    for (var i = 0; i < deps.length; i++) {
      results.push({text: deps[i].short + ': ' + deps[i].long,
                    value: deps[i].short});
    }
    this.view_.setResults(results);
  } else {
    // They've started typing numbers, look for courses in that department.
    var courses = CourseData.getCourseNamesForDepartmentByPrefix(dep, num);
    var results = [];
    for (var i = 0; i < courses.length; i++) {
      results.push({text: dep + ' ' + courses[i] + ': ' +
                           CourseData.getCourse(dep, courses[i]).getTitle(),
                    value: dep + courses[i]});
    }
    this.view_.setResults(results);
  }
};

/*
 * The callback for handling a submit. Returns true if the submit was
 * successful.
 * PARAM-TYPE: string input The current input.
 * RETURN-TYPE: boolean
 */
SearchBoxController.prototype.submitInput = function(input) {
  var match = CourseData.REGEXP.exec(input);
  if (!match) return false;
  var dep = match[1].trim().toUpperCase();
  var num = match[2].trim().toUpperCase();
  if (num == '') {
    // Do nothing (for now). They've just autocompleted the department.
  } else {
    var course = CourseData.getCourse(dep, num);
    if (course) {
      this.manager_.notifyCourseAdded(course);
      this.view_.clearInput();
      return true;
    }
  }
  return false;
};
