/*
 * This is a file for the PreviewController which handles drawing schedules on
 * three calendars.
 */

/*
 * Constructor takes:
 * PARAM-TYPE: jQuery parent The parent element for the SearchBoxView.
 * PARAM-TYPE: MainController manager The controller that manages this one.
 */
PreviewController = function(parent, manager) {
  // TYPE: PreviewView
  this.view_ = new PreviewView(parent, this);
  this.view_.render();
  // TYPE: MainController
  this.manager_ = manager;
};


/*
 * Given a course list, draws each of the courses on the view.
 * PARAM-TYPE: Course[] courses The list of courses to draw.
 */
PreviewController.prototype.displayCourseList = function(courses) {

};

/*
 * Draws a schedule of courses. This may or may be different from above.
 * To be implmented later?
 */
PreviewController.prototype.displaySchedule = function() {
};
