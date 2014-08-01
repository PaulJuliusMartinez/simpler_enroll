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
  // TYPE: SearchBoxView
  this.view_ = new SearchBoxView(this);
  this.view_.decorate($(parent.children()[0]));
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
  var searchBox = this;
  if (num == '') {
    // They haven't typed numbers yet, so fetch the departments.
    CourseData.fetchDepartmentsByPrefix(dep, function(prefix, deps) {
      searchBox.suggestDepartments(prefix, deps);
    });
  } else {
    // Otherwise, get specific courses.
    CourseData.fetchCoursesByPrefix(dep, num, function(dep, num, courses) {
      searchBox.suggestCourses(dep, num, courses);
    });
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
 * The callback for handling a submit.
 * PARAM-TYPE: string input The current input.
 */
SearchBoxController.prototype.submitInput = function(input) {
  var match = CourseData.REGEXP.exec(input);
  if (!match) return;
  var dep = match[1].trim().toUpperCase();
  var num = match[2].trim().toUpperCase();
  if (num == '') {
    // Do nothing (for now). They've just autocompleted the department.
    this.view_.setInput(dep);
  } else {
    // TODO/VERYIMPORTANT CHANGE THIS TO A DISPATCH COURSE_ADDED EVENT.
    var searchBox = this;
    CourseData.getCourse(dep, num, function(course) {
      if (course) {
        $.Events(Events.COURSE_ADDED).dispatch(course);
        searchBox.view_.clearInput();
        searchBox.view_.clearResults();
      }
    });
  }
};
