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
  this.view_ = new PreviewView(this);
  this.view_.render(parent);
  // TYPE: MainController
  this.manager_ = manager;
};


/*
 * Given a course list, draws each of the courses on the view.
 * PARAM-TYPE: Course[] courses The list of courses to draw.
 */
PreviewController.prototype.displayCourseList = function(courses) {
  this.view_.clearCalendars();

  for (var quarter = 0; quarter < 3; quarter++) {
    var units = 0;
    for (var i = 0; i < courses.length; i++) {
      if (courses[i].isOfferedIn(quarter) &&
          courses[i].getStatus().getQuarterStatus(quarter) &&
          courses[i].getStatus().getEnrollmentStatus() != Status.DROP) {
        this.displaySectionList_(
            courses[i].getPrimarySectionsForQuarter(quarter), quarter);
        // Maybe display secondary sections here too?
        units += courses[i].getMaxUnits();
      }
    }
    this.view_.setUnits(quarter, units);
    this.view_.getCalendarView(quarter).draw();
  }
};

/*
 * Add a set of sections to a calendar for a certain quarter.
 * PARAM-TYPE: Section[] sections The sections to add.
 * PARAM-TYPE: number quarter Which quarter these sections are in.
 */
PreviewController.prototype.displaySectionList_ = function(sections, quarter) {
  for (var i = 0; i < sections.length; i++) {
    var meetings = sections[i].getMeetings();
    for (var j = 0; j < meetings.length; j++) {
      this.view_.getCalendarView(quarter).addMeeting(meetings[j]);
    }
  }
};


/*
 * Draws a schedule of courses. This may or may be different from above.
 * To be implmented later?
 */
PreviewController.prototype.displaySchedule = function() {
};
