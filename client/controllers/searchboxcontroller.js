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

  // Listen to CourseData for completions
  var searchBox = this;
  $.Events(Events.DEPARTMENTS_BY_PREFIX).listen(function(prefix, deps) {
    searchBox.suggestDepartments(prefix, deps);
  });
  $.Events(Events.COURSES_BY_PREFIX).listen(function(dep, num, courses) {
    searchBox.suggestCourses(dep, num, courses);
  });
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
  var match = CourseData.REGEXP.exec(input.toUpperCase());
  var dep = match[1].trim().toUpperCase();
  var num = match[2].trim().toUpperCase();
  if (num == '') {
    // They haven't typed numbers yet, so fetch the departments.
    CourseData.fetchDepartmentsByPrefix(dep);
    // suggestDepartments will be called upon execution.
  } else {
    // Otherwise, get specific courses.
    CourseData.fetchCoursesByPrefix(dep, num);
    // suggestCourses will be called upon execution.
  }
};

/*
 * Called whenever CourseData has Departments ready.
 * PARAM-TYPE: string prefix The common prefix of the departments. (Assumed to
 *     be in all CAPS.)
 * PARAM-TYPE: Department[] deps The departments.
 */
SearchBoxController.prototype.suggestDepartments = function(prefix, deps) {
  var currentInput = this.view_.getInput().toUpperCase();
  var match = CourseData.REGEXP.exec(currentInput);
  // Return if no match, or the entered numbers, or it's not the right prefix
  // anymore.
  if (!match || match[2].trim() != '' || match[1].trim() != prefix) return;

  // Build up the data to give back to the view.
  var results = [];
  for (var i = 0; i < deps.length; i++) {
    results.push({text: deps[i].short + ': ' + deps[i].long,
                  value: deps[i].short});
  }
  this.view_.setResults(results);
};

/*
 * Called whenever CourseData has a list of Courses ready. Both strings are
 * assumed to be in all caps.
 * PARAM-TYPE: string dep The department all the courses are in.
 * PARAM-TYPE: string num The number prefix of all the courses.
 * PARAM-TYPE: Course[] The courses that match the prefixes.
 */
SearchBoxController.prototype.suggestCourses = function(dep, num, courses) {
  var currentInput = this.view_.getInput().toUpperCase();
  var match = CourseData.REGEXP.exec(currentInput);
  // Return if the prefixes don't match anymore.
  if (!match || match[1].trim() != dep || match[2].trim() != num) return;

  var results = [];
  for (var i = 0; i < courses.length; i++) {
    results.push({text: courses[i].getShortName() + ': ' +
                            courses[i].getTitle(),
                  value: courses[i].getShortName()});
  }

  this.view_.setResults(results);
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
