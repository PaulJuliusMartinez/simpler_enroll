/*
 * This is the view for the three calendars that will constantly be showing all
 * the selected classes.
 */

/*
 * Constructor takes:
 * PARAM-TYPE: PreviewController controller The controller of the view.
 */
PreviewView = function(controller) {
  // TYPE: PreviewController
  this.controller_ = controller;
};


// TYPE: CalendarView[] The three calendars.
PreviewView.prototype.calendars_ = [];

// TYPE: jQuery[] The three unit counters.
PreviewView.prototype.unitLabels_ = [];

/*
 * Decorates the three calendars.
 * PARAM-TYPE: jQuery parent The parent element of the view.
 */
PreviewView.prototype.decorate = function(parent) {
  var calendars = parent.find('.' + PreviewView.CALENDAR);
  var units = parent.find('.' + PreviewView.UNITS);

  for (var i = 0; i < 3; i++) {
    this.calendars_.push(new CalendarView($(calendars[i]), i));
    this.unitLabels_.push($(units[i]));
    this.calendars_[i].render();
  }
};

/*
 * Clears the calendars.
 */
PreviewView.prototype.clearCalendars = function() {
  for (var i = 0; i < 3; i++) this.calendars_[i].clear();
};

/*
 * Get the calendar view for a particular quarter.
 * PARAM-TYPE: number quarter Which quarter.
 * RETURN-TYPE: CalendarView
 */
PreviewView.prototype.getCalendarView = function(quarter) {
  return this.calendars_[quarter];
};

/*
 * Set the units for the quarter.
 * PARAM-TYPE: number quarter Which quarter.
 * PARAM-TYPE: number units How many units.
 */
PreviewView.prototype.setUnits = function(quarter, units) {
  this.unitLabels_[quarter].text(units + ' Units');
};

// CSS Constants
PreviewView.LEFT_THIRD = 'preview-view-third preview-view-left';
PreviewView.MIDDLE_THIRD = 'preview-view-third preview-view-middle';
PreviewView.RIGHT_THIRD = 'preview-view-third preview-view-right';
PreviewView.HEADER = 'preview-view-header';
PreviewView.QUARTER_LABEL = 'preview-view-quarter';
PreviewView.UNITS = 'preview-view-units';
PreviewView.CALENDAR = 'preview-view-calendar';
