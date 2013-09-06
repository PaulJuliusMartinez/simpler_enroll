/*
 * This is the view for the three calendars that will constantly be showing all
 * the selected classes.
 */

/*
 * Constructor takes:
 * PARAM-TYPE: jQuery parent The parent element of the view.
 * PARAM-TYPE: PreviewController controller The controller of the view.
 */
PreviewView = function(parent, controller) {
  // TYPE: jQuery
  this.parent_ = parent;
  // TYPE: PreviewController
  this.controller_ = controller;
};


// TYPE: CalendarView[] The three calendars.
PreviewView.prototype.calendars_ = [];

// TYPE: jQuery[] The three unit counters.
PreviewView.prototype.unitLabels_ = [];

/*
 * Renders and initializes the three calendars.
 */
PreviewView.prototype.render = function() {
  var leftThird = $('<div>').addClass(PreviewView.LEFT_THIRD).
                             append(this.createQuarterHeader('Autumn', 0),
                                    $('<div>').addClass(PreviewView.CALENDAR));
  var midThird = $('<div>').addClass(PreviewView.MIDDLE_THIRD).
                            append(this.createQuarterHeader('Winter', 1),
                                   $('<div>').addClass(PreviewView.CALENDAR));
  var rightThird = $('<div>').addClass(PreviewView.RIGHT_THIRD).
                              append(this.createQuarterHeader('Spring', 2),
                                     $('<div>').addClass(PreviewView.CALENDAR));

  // Create and add calendars.
  this.calendars_.push(new CalendarView($(leftThird.children()[1])));
  this.calendars_.push(new CalendarView($(midThird.children()[1])));
  this.calendars_.push(new CalendarView($(rightThird.children()[1])));
  for (var i = 0; i < 3; i++) {
    this.calendars_[i].render();
  }

  this.parent_.append(leftThird, midThird, rightThird);
};

/*
 * Creates a div for the header bar, given the quarter name.
 * PARAM-TYPE: string quarter The quarter.
 */
PreviewView.prototype.createQuarterHeader = function(quarter) {
  var header = $('<div>').addClass(PreviewView.HEADER);
  var quarter = $('<span>').addClass(PreviewView.QUARTER_LABEL).
                            text(quarter + ' Quarter:');
  var units = $('<span>').addClass(PreviewView.UNITS).text('0 Units');
  this.unitLabels_.push(units);

  header.append(quarter, units);
  return header;
};

/*
 * Takes a list of courses and divides up their sections and meetings and gives
 * them to the calendars to draw.
 * PARAM-TYPE: Course[] courses A list of courses.
 */
PreviewView.prototype.displayCourses = function(courses) {
  for (var i = 0; i < 3; i++) this.calendars_[i].clear();

  for (var quarter = 0; quarter < 3; quarter++) {
    for (var i = 0; i < courses.length; i++) {
      if (courses[i].isOfferedIn(quarter) &&
          courses[i].getStatus().getQuarterStatus(quarter) &&
          courses[i].getStatus().getEnrollmentStatus() != Status.DROP) {
        var primarySections = courses[i].getPrimarySectionsForQuarter(quarter);
        for (var j = 0; j < primarySections.length; j++) {
          var section = primarySections[j];
          var meetings = section.getMeetings();
          for (var k = 0; k < meetings.length; k++) {
            this.calendars_[quarter].addMeeting(meetings[k]);
          }
        }
      }
    }
  }

  for (var i = 0; i < 3; i++) this.calendars_[i].draw();
};

// CSS Constants
PreviewView.LEFT_THIRD = 'preview-view-third preview-view-left';
PreviewView.MIDDLE_THIRD = 'preview-view-third preview-view-middle';
PreviewView.RIGHT_THIRD = 'preview-view-third preview-view-right';
PreviewView.HEADER = 'preview-view-header';
PreviewView.QUARTER_LABEL = 'preview-view-quarter';
PreviewView.UNITS = 'preview-view-units';
PreviewView.CALENDAR = 'preview-view-calendar';
