/*
 * This is the class that draw one of the little rectangles on the calendars.
 */

/*
 * Constructor takes:
 * PARAM-TYPE: Meeting meeting The Meeting we're displaying.
 * PARAM-TYPE: number day The date we're displaying.
 * PARAM-TYPE: CalendarView calendar The calendar it's a part of.
 */
MeetingDisplay = function(meeting, day, calendar) {
  // TYPE: Meeting
  this.meeting_ = meeting;
  // TYPE: number
  this.day_ = day;
  // TYPE: CalendarView
  this.calendar_ = calendar;
};


// TYPE: jQuery The visual element.
this.elem_;

/*
 * Draws the rectangle in the given position.
 * PARAM-TYPE: number num Which meeting it is in this time slot.
 * PARAM-TYPE: number total How many meetings are in this time slot.
 */
MeetingDisplay.prototype.render = function(num, total) {
  var headerHeight = this.calendar_.getHeaderRowHeight();
  var hourHeight = this.calendar_.getNormalRowHeight();
  var numHours = (this.meeting_.getStartTime() / 60) - 9;
  var height = hourHeight * this.meeting_.getLength() / 60;
  var yOffset = headerHeight + hourHeight * numHours;
  var dayWidth = this.calendar_.getDayWidth();
  var xOffset = this.calendar_.getHourWidth() + this.day_ * dayWidth;

  var width = dayWidth / total;
  xOffset += (num - 1) * dayWidth / total;

  var status = this.meeting_.getSection().
                             getCourse().getStatus().getEnrollmentStatus();
  var title = this.meeting_.getSection().getCourse().getShortName();

  var colorClass = (status == Status.ENROLL) ? MeetingDisplay.ENROLLED :
                                                 MeetingDisplay.PLANNED;

  var text = $('<div>').addClass(MeetingDisplay.TEXT).text(title);

  // The little +/- 1/2 are to account for the borders.
  this.elem_ = $('<div>').addClass(MeetingDisplay.BOX).
                          addClass(colorClass).
                          css('top', yOffset + 'px').
                          css('height', (height - 2) + 'px').
                          css('left', (xOffset + 1)  + 'px').
                          css('width', (width - 2) + 'px').
                          append(text);
  this.calendar_.getContainer().append(this.elem_);

  // Squeeze in the text
  var fontSize = parseInt(text.css('font-size'), 10);
  // 2 Fudge factor to make sure there's space between text and border.
  while (fontSize > 6 && text.get()[0].scrollWidth + 2 > width) {
    fontSize--;
    text.css('font-size', fontSize + 'pt');
  }

  var popup = new CourseInfoPopup(this.elem_, this.meeting_);
  popup.render();
};

/*
 * Removes all the elements associated with this from the DOM.
 */
MeetingDisplay.prototype.remove = function() {
  this.elem_.remove();
};


// CSS Constants
MeetingDisplay.BOX = 'meeting-display-box';
MeetingDisplay.TEXT = 'meeting-display-text';
MeetingDisplay.ENROLLED = 'meeting-display-enrolled';
MeetingDisplay.PLANNED = 'meeting-display-planned';
