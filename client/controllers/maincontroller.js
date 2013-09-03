/*
 * This is the MainController that is in charge of the entire application and
 * ensuring communciation between all the components.
 */

/*
 * Constructor takes the main element of the page.
 * PARAM-TYPE: jQuery parent The parent element for the MainView.
 */
MainController = function(parent) {
  // TYPE: MainViewController
  this.view_ = new MainView(parent, this);
  this.view_.render();

  var containers = this.view_.getContainers();
  // TYPE: SearchBoxController
  this.searchBox_ = new SearchBoxController(
      containers[MainView.SEARCH_BOX], this);
  // TYPE: CourseListController
  this.courseList_ = new CourseListController(
      containers[MainView.COURSE_LIST], this);
  // TYPE: PreviewController
  this.preview_ = new PreviewController(
      containers[MainView.SCHEDULE_PREVIEW], this);
};


/*
 * Called when a class is added by the search box.
 * PARAM-TYPE: Course course The course added.
 */
MainController.prototype.notifyCourseAdded = function(course) {
  this.courseList_.addCourse(course);
  var courses = this.courseList_.getCourses();
  this.preview_.displayCourseList(courses);
};

/*
 * Called when something in the course list changes.
 */
MainController.prototype.notifyCourseListChange = function() {
  // When this happens we'll have to collect the data again from the course list
  // and send it out to the schedule preview to rerender.
  window.console.log('Something changed!');
};
