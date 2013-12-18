/*
 * This is the MainController that is in charge of the entire application and
 * ensuring communciation between all the components.
 */

/*
 * Constructor takes no arguments.
 */
MainController = function() {
  // TYPE: SearchBoxController
  this.searchBox_ = new SearchBoxController($('#search-bar'));
  // TYPE: CourseListController
  this.courseList_ = new CourseListController($('#course-list'));
  // TYPE: PreviewController
  this.preview_ = new PreviewController($('#bottom-section'));

  // Create tabbed area.
  var tabs = new Tabs();
  tabs.render($('#top-right'));
  var classInfoTab = tabs.addTab('Class Information');
  var sectionTab = tabs.addTab('Sections');
  tabs.displayTab(0);

  // TYPE: InformationController
  this.information_ = new InformationController(classInfoTab);
  // TYPE: SectionController
  this.sections_ = new SectionController(sectionTab);
};


/*
 * Called when this hears a COURSE_ADDED event.
 * PARAM-TYPE: Course course The course added.
 */
MainController.prototype.addCourse = function(course) {
  this.courseList_.addCourse(course);
  this.sections_.addCourse(course);
  this.information_.addCourse(course);
  this.refreshComponents();
  // Save state
  var courses = this.courseList_.getCourses();
  UserState.saveCourses(courses);
};

/*
 * Called when a course is removed.
 * PARAM-TYPE: Course course the removed course.
 */
MainController.prototype.removeCourse = function(course) {
  this.sections_.removeCourse(course);
  this.refreshComponents();
  // Save state
  var courses = this.courseList_.getCourses();
  UserState.saveCourses(courses);
};

/*
 * Called when something in the course list changes.
 */
MainController.prototype.refreshComponents = function() {
  var courses = this.courseList_.getCourses();
  this.preview_.displayCourseList(courses);
  // Save state
  UserState.saveCourses(courses);
};
