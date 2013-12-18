/*
 * File for displaying course information.
 */

/*
 * Constructor takes the element to decorate.
 * PARAM-TYPE: jQuery parent The parent element for the InformationView.
 */
InformationController = function(parent) {
  // TYPE: SectionView
  this.view_ = new InformationView(this);
  this.view_.decorate(parent);

  $.Events(Events.COURSE_SELECTED).listen(function(course, ignored) {
    this.showCourse(course);
  }.bind(this));
};


/*
 * Adds a course.
 * PARAM-TYPE: Course course The course to add.
 */
InformationController.prototype.addCourse = function(course) {
  this.view_.showCourse(course);
};

/*
 * Show a specific course.
 * PARAM-TYPE: Course course The course to show.
 */
InformationController.prototype.showCourse = function(course) {
  this.view_.showCourse(course);
};
