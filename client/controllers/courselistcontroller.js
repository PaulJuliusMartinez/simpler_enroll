/*
 * This file implements an interactive list of selected courses. Various
 * settings may be set here regarding specific courses.
 */

/*
 * Constructor takes the parent element of the view and the manager of the view.
 * PARAM-TYPE: jQuery parent The parent element for the SearchBoxView.
 * PARAM-TYPE: MainController manager The controller that manages this one.
 */
CourseListController = function(parent, manager) {
  // TYPE: CourseListView
  this.view_ = new CourseListView(parent, this);
  this.view_.render();
  // TYPE: MainController
  this.manager_ = manager;
  // TYPE: Object.Course
  this.courses_ = {};
};


/*
 * Adds a course to the list. Will not add duplicates.
 * PARAM-TYPE: Course course The course added.
 */
CourseListController.prototype.addCourse = function(course) {
  if (!this.courses_[course.getID()]) {
    this.courses_[course.getID()] = course;
    this.view_.addCourse(course);
  }
};

/*
 * Removes a course from the list.
 * PARAM-TYPE: Course course The course to remove.
 */
CourseListController.prototype.removeCourse = function(course) {
  if (this.courses_[course.getID()]) {
    this.courses_[course.getID()] = null;
    this.view_.removeCourse(course);
    this.manager_.notifyCourseListChange();
  }
};

/*
 * Mark whether or not a course should be considered to be taken in this quarter.
 * PARAM-TYPE: Course course What course.
 * PARAM-TYPE: number quarter What quarter the course will/won't be considered
 *     in. This number should be in the range [0, 2].
 * PARAM-TYPE: boolean considered If the class should be considered.
 */
CourseListController.prototype.willTakeClassInQuarter = function(
    course, quarter, considered) {
  // Alert the main controller!
  window.console.log(course.getShortName() + (considered ? ' will ' : "won't ") + 'be considered for the ' + (quarter + 1) + ' quarter.');
};
