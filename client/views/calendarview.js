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
  // TYPE: ClassRenderer
  this.classRenderer_ = new ClassRenderer(this);
};

// TYPE: jQuery The internal container of the calendar.
CalendarView.prototype.container_;

CalendarView.HOUR_WIDTH = 30;
CalendarView.DAY_WIDTH = 75;
CalendarView.ROW_HEIGHT = 25;

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
  this.container_ = this.parent_.firstChild;

  // Add the 'hour' rows to the table
  var table = this.parent_.find('tbody');
  var hours = [9, 10, 11, 12, 1, 2, 3, 4, 5, 6];
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
 * Returns the container element of the Calendar. If called before render(),
 * this returns null.
 * @return Jquery elem The container element, as a Jquery object.
 */
CalendarView.prototype.getContainer = function() {
  return this.element_;
};

/*
 * Gets the width of the first column.
 */
CalendarView.prototype.getHourWidth = function() {
  this.element_.children('tr')[0].children[0].clientWidth;
};

/*
 * Gets the width of one of the day columns.
 */
CalendarView.prototype.getDayWidth = function() {
  this.element_.children('tr')[0].children[1].clientWidth;
};

/*
 * Gets the height of the header row.
 */
CalendarView.prototype.getHeaderRowHeight = function() {
  this.element_.children('th')[0].children[0].clientHeight;
};

/*
 * Gets the height of a normal row.
 */
CalendarView.prototype.getNormalRowHeight = function() {
  this.element_.children('td')[0].children[0].clientHeight;
};

// CSS Constants:
CalendarView.CONTAINER = 'calendar-view-container';
CalendarView.DAYS = 'calendar-view-days';
CalendarView.HOUR_NUM = 'calendar-view-hour-num';
CalendarView.HOUR_ROW = 'calendar-view-hour-row';
CalendarView.FIRST_COLUMN = 'calendar-view-first-column';
CalendarView.LAST_COLUMN = 'calendar-view-last-column';
