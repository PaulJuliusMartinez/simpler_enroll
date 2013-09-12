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
  this.searchBox_ = new SearchBoxController($('#search-bar'), this);
  // TYPE: CourseListController
  this.courseList_ = new CourseListController($('#course-list'), this);
  // TYPE: PreviewController
  this.preview_ = new PreviewController($('#bottom-section'), this);

  var main = this;
  $.Events(Events.COURSE_ADDED).listen(function(course) {
    main.addCourse(course);
  });
};


/*
 * Called when this hears a COURSE_ADDED event.
 * PARAM-TYPE: Course course The course added.
 */
MainController.prototype.addCourse = function(course) {
  this.courseList_.addCourse(course);
  var courses = this.courseList_.getCourses();
  this.preview_.displayCourseList(courses);
};

/*
 * Called when something in the course list changes.
 */
MainController.prototype.notifyCourseListChange = function() {
  var courses = this.courseList_.getCourses();
  this.preview_.displayCourseList(courses);
};
