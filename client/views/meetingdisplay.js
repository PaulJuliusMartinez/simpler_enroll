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

  var id = meeting.getSection().getID();
  var display = this;
  $.Events(Events.SECTION_ACCENT_PREFIX + id).listen(function() {
    display.accent();
  });
  $.Events(Events.SECTION_UNACCENT_PREFIX + id).listen(function() {
    display.unaccent();
  });
};


// TYPE: jQuery The visual element.
this.elem_;

// TYPE: CourseInfoPopup The popup with section information.
this.popup_;

/*
 * Draws the rectangle in the given position.
 * PARAM-TYPE: number num Which meeting it is in this time slot.
 * PARAM-TYPE: number total How many meetings are in this time slot.
 */
MeetingDisplay.prototype.render = function(num, total) {
  var rowHeight = 100 / this.calendar_.getNumRows();
  var numHours = (this.meeting_.getStartTime() / 60) - 9;
  var height = rowHeight * this.meeting_.getLength() / 60;
  var yOffset = rowHeight * (1 + numHours);
  var dayWidth = 18; // 18%
  var xOffset = 10 + this.day_ * dayWidth;

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
                          css('top', yOffset + '%').
                          css('height', height + '%').
                          css('left', xOffset  + '%').
                          css('width', 'calc(' + width + '%' + ' - 2px)').
                          append(text);
  this.calendar_.getContainer().append(this.elem_);

  // Squeeze in the text
  var fontSize = parseInt(text.css('font-size'), 10);
	var divWidth = this.elem_.get()[0].scrollWidth;
  while (fontSize > 6 && text.get()[0].scrollWidth > divWidth) {
    fontSize -= 2;
    text.css('font-size', fontSize + 'pt');
  }

  this.popup_ = new CourseInfoPopup(this.elem_, this.meeting_, this.day_);
  this.popup_.render();

  // Add accent/unaccent events.
  var id = this.meeting_.getSection().getID();
  var popup = this.popup_;
  this.elem_.hover(function() {
                     popup.show();
                     $.Events(Events.SECTION_ACCENT_PREFIX + id).dispatch();
                   },
                   function() {
                     popup.hide();
                     $.Events(Events.SECTION_UNACCENT_PREFIX + id).dispatch();
                   });

  // Add course select event.
  this.elem_.click(function() {
    $.Events(Events.COURSE_SELECTED).dispatch(
        this.meeting_.getSection().getCourse(), this.calendar_.getQuarter());
  }.bind(this));
};

/*
 * Removes all the elements associated with this from the DOM.
 */
MeetingDisplay.prototype.remove = function() {
  this.elem_.remove();
};

/*
 * Called when the section should be accented.
 */
MeetingDisplay.prototype.accent = function() {
  if (this.elem_) this.elem_.addClass(MeetingDisplay.ACCENTED);
};

/*
 * Called when the section should be unaccented.
 */
MeetingDisplay.prototype.unaccent = function() {
  if (this.elem_) this.elem_.removeClass(MeetingDisplay.ACCENTED);
};


// CSS Constants
MeetingDisplay.BOX = 'meeting-display-box';
MeetingDisplay.TEXT = 'meeting-display-text';
MeetingDisplay.ENROLLED = 'meeting-display-enrolled';
MeetingDisplay.PLANNED = 'meeting-display-planned';
MeetingDisplay.ACCENTED = 'meeting-display-accented';
