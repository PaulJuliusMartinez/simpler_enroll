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
