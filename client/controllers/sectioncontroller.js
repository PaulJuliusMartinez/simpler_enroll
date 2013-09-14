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
 * Select all/none of the primary/secondary sections.
 * PARAM-TYPE: boolean isSelected True if select all was clicked.
 * PARAM-TYPE: boolean isPrimary True if the button for the primary was clicked.
 */
SectionController.prototype.viewAll = function(isSelected, isPrimary) {
  //var course = this.view_.getSelectedCourse();
  //var quarter = this.view_.getSelectedQuarter();
  alert(isSelected + ' ' + isPrimary);
};
