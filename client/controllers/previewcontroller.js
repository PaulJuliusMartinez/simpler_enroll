/*
 * This is a file for the PreviewController which handles drawing schedules on
 * three calendars.
 */

/*
 * Constructor takes:
 * PARAM-TYPE: jQuery parent The parent element for the SearchBoxView.
 */
PreviewController = function(parent) {
  // TYPE: PreviewView
  this.view_ = new PreviewView(this);
  this.view_.decorate(parent);
};


/*
 * Given a course list, draws each of the courses on the view.
 * PARAM-TYPE: Course[] courses The list of courses to draw.
 */
PreviewController.prototype.displayCourseList = function(courses) {
  this.view_.clearCalendars();

  for (var quarter = 0; quarter < 3; quarter++) {
    var plannedUnits = 0;
    var enrolledUnits = 0;
    for (var i = 0; i < courses.length; i++) {
      if (courses[i].isOfferedIn(quarter) &&
          courses[i].getStatus().getQuarterStatus(quarter) &&
          courses[i].getStatus().getEnrollmentStatus() != Status.DROP) {
        this.displaySectionList_(
            courses[i].getPrimarySectionsForQuarter(quarter), quarter);
        this.displaySectionList_(
            courses[i].getSecondarySectionsForQuarter(quarter), quarter);

        switch (courses[i].getStatus().getEnrollmentStatus()) {
          case Status.ENROLL:
            enrolledUnits += courses[i].getMaxUnits();
          case Status.PLAN:
            plannedUnits += courses[i].getMaxUnits();
          default:
            break;
        }
      }
    }
    this.view_.setUnits(quarter, enrolledUnits, plannedUnits);
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
    if (sections[i].shouldShow()) {
      var meetings = sections[i].getMeetings();
      for (var j = 0; j < meetings.length; j++) {
        this.view_.getCalendarView(quarter).addMeeting(meetings[j]);
      }
    }
  }
};


/*
 * Draws a schedule of courses. This may or may be different from above.
 * To be implmented later?
 */
PreviewController.prototype.displaySchedule = function() {
};
