/*
 * This file contains the Calendar object responsible for visually displaying
 * the calendar in the HTML.
 */

Calendar = function() {
  // Nothing here yet!
};

Calendar.prototype.element_ = null;

Calendar.HOUR_WIDTH = 30;
Calendar.DAY_WIDTH = 75;
Calendar.ROW_HEIGHT = 25;

/**
 * Call render() before doing anything with the calendar. This builds up the
 * internal DOM structure.
 * @param Jquery elem The parent element of the calendar.
 */
Calendar.prototype.render = function(elem) {
  elem.append(
      $('<div>').addClass('calendar-container').append(
        $('<table>').append(
          $('<tr>').addClass('calendar-days').append(
            $('<th>').addClass('calendar-hour-num'),
            $('<th>').addClass('calendar-first-column').text('Mon.'),
            $('<th>').text('Tues.'),
            $('<th>').text('Wed.'),
            $('<th>').text('Thu.'),
            $('<th>').addClass('calendar-last-column').text('Fri.')
          )
        )
      )
  );
  this.element_ = elem.children().last();

  // Add the 'hour' rows to the table
  var table = elem.find('table');
  var hours = [9, 10, 11, 12, 1, 2, 3, 4, 5, 6];
  for (var i = 0; i < hours.length; i++) {
    table.append(
        $('<tr>').addClass('calendar-hour-row').append(
          $('<td>').addClass('calendar-hour-num').text(hours[i]),
          $('<td>').addClass('calendar-first-column'),
          $('<td>'),
          $('<td>'),
          $('<td>'),
          $('<td>').addClass('calendar-last-column')
        )
    );
  }
};

/*
 * Returns the container element of the Calendar. If called before render(),
 * this returns null.
 * @return Jquery elem The container element, as a Jquery object.
 */
Calendar.prototype.getContainer = function() {
  return this.element_;
};
