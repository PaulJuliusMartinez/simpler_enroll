/*
 * File for displaying lecture/discussion sections for a class and interacting
 * with them.
 */

/*
 * Constructor takes the element to decorate.
 * PARAM-TYPE: jQuery parent The parent element for the SectionView.
 */
SectionController = function(parent) {
  // TYPE: SectionView
  this.view_ = new SectionView(this);
  this.view_.decorate(parent);
};


/*
 * Adds a course.
 * PARAM-TYPE: Course course The course to add.
 */
SectionController.prototype.addCourse = function(course) {
  this.view_.addCourse(course);
};

/*
 * Removes a course.
 * PARAM-TYPE: Course course The course to remove.
 */
SectionController.prototype.removeCourse = function(course) {
  this.view_.removeCourse(course);
};

/*
 * Select all/none of the primary/secondary sections.
 * PARAM-TYPE: boolean all True if select all was clicked.
 * PARAM-TYPE: boolean isPrimary True if the button for the primary was clicked.
 */
SectionController.prototype.viewAll = function(all, isPrimary) {
  var helper = this.view_.getSelectedCourse();
  if (!helper) return;
  var quarter = this.view_.getSelectedQuarter();

  var displays = (isPrimary ? helper.primarySectionDisplays :
                              helper.secondarySectionDisplays)[quarter];
  for (var i = 0; i < displays.length; i++) {
    displays[i].setShow(all);
  }
  $.Events(Events.COURSE_CHANGE).dispatch();
};
