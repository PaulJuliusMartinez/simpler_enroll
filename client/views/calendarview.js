/*
 * This file contains the Calendar object responsible for visually displaying
 * the calendar in the HTML.
 */

/*
 * Constructor takes the parent element of the calendar.
 * PARAM-TYPE: jQuery parent The parent element of the calendar.
 */
CalendarView = function(parent) {
  // TYPE: jQuery
  this.parent_ = parent;
  // TYPE: MeetingRenderer
  this.meetingRenderer_ = new MeetingRenderer(this);
};


// TYPE: jQuery The internal container of the calendar.
CalendarView.prototype.container_;

// TYPE: boolean Whether the calendar has been resized.
CalendarView.prototype.resized_ = false;

// TYPE: number number of rows.
CalendarView.prototype.numRows_;

/*
 * This builds up the internal DOM structure.
 */
CalendarView.prototype.render = function() {
  this.parent_.append(
      $('<div>').addClass(CalendarView.CONTAINER).append(
        $('<table>').append(
          $('<tr>').addClass(CalendarView.DAYS).append(
            $('<th>').addClass(CalendarView.HOUR_NUM),
            $('<th>').addClass(CalendarView.FIRST_COLUMN).text('Mon.'),
            $('<th>').text('Tues.'),
            $('<th>').text('Wed.'),
            $('<th>').text('Thu.'),
            $('<th>').addClass(CalendarView.LAST_COLUMN).text('Fri.')
          )
        )
      )
  );
  this.container_ = $(this.parent_.get()[0].firstChild);

  // Add the 'hour' rows to the table
  var table = this.parent_.find('tbody');
  var hours = [9, 10, 11, 12, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  this.numRows_ = hours.length + 1;
  for (var i = 0; i < hours.length; i++) {
    table.append(
        $('<tr>').addClass(CalendarView.HOUR_ROW).append(
          $('<td>').addClass(CalendarView.HOUR_NUM).text(hours[i]),
          $('<td>').addClass(CalendarView.FIRST_COLUMN),
          $('<td>'),
          $('<td>'),
          $('<td>'),
          $('<td>').addClass(CalendarView.LAST_COLUMN)
        )
    );
  }
};

/*
 * Gives a meeting to add to the calendar. Does not redraw.
 * PARAM-TYPE: Meeting meeting The meeting to add.
 */
CalendarView.prototype.addMeeting = function(meeting) {
  this.meetingRenderer_.addMeeting(meeting);
};

/*
 * Draws all the meetings.
 */
CalendarView.prototype.draw = function() {
  this.meetingRenderer_.draw();
};

/*
 * Clears the meeting renderer.
 */
CalendarView.prototype.clear = function() {
  this.meetingRenderer_.clear();
};

/*
 * Returns the container element of the Calendar. If called before render(),
 * this returns null.
 * RETURN-TYPE: Jquery elem The container element, as a Jquery object.
 */
CalendarView.prototype.getContainer = function() {
  return this.container_;
};

/*
 * Gets the number of rows in the calendar.
 * RETURN-TYPE: number
 */
CalendarView.prototype.getNumRows = function() {
  return this.numRows_;
};

/*
 * Gets the width of the first column.
 */
CalendarView.prototype.getHourWidth = function() {
  return this.container_.find('th').get()[0].clientWidth;
};

/*
 * Gets the width of one of the day columns.
 */
CalendarView.prototype.getDayWidth = function() {
  return this.container_.find('th').get()[1].clientWidth;
};

/*
 * Gets the height of the header row.
 */
CalendarView.prototype.getRowHeight = function() {
  return this.container_.find('tr').get()[0].clientHeight;
};

// CSS Constants:
CalendarView.CONTAINER = 'calendar-view-container';
CalendarView.DAYS = 'calendar-view-days';
CalendarView.HOUR_NUM = 'calendar-view-hour-num';
CalendarView.HOUR_ROW = 'calendar-view-hour-row';
CalendarView.FIRST_COLUMN = 'calendar-view-first-column';
CalendarView.LAST_COLUMN = 'calendar-view-last-column';
