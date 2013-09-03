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

  this.elem_ = $('<div>').addClass(MeetingDisplay.BOX).
                          css('top', yOffset + 'px').
                          css('height', height + 'px').
                          css('left', xOffset + 'px').
                          css('width', width + 'px').
                          css('position', 'absolute').
                          css('border', '1px solid black');
  this.calendar_.getContainer().append(this.elem_);
};

/*
 * Removes all the elements associated with this from the DOM.
 */
MeetingDisplay.prototype.remove = function() {
  this.elem_.remove();
};
