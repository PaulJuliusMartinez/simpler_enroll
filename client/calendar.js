/*
 * This file contains the Calendar object responsible for visually displaying
 * the calendar in the HTML.
 */

Calendar = function() {
  // Nothing here yet!
};

/**
 * Call render() before doing anything with the calendar. This builds up the
 * internal DOM structure.
 * @param JqueryElement elem The parent element of the calendar.
 */
Calendar.prototype.render = function(elem) {
  elem.append(
      $('<div></div>').addClass('calendar-container').append(
        $('<table></table>').append(
          $('<tr></tr>').addClass('calendar-days').append(
            $('<th></th>').addClass('calendar-first-column').text('Monday'),
            $('<th></th>').text('Tuesday'),
            $('<th></th>').text('Wendesday'),
            $('<th></th>').text('Thursday'),
            $('<th></th>').addClass('calendar-last-column').text('Friday')
          ),
          $('<tr></tr>').addClass('calendar-hour-row').append(
            $('<td></td>').addClass('calendar-first-column'),
            $('<td></td>'),
            $('<td></td>'),
            $('<td></td>'),
            $('<td></td>').addClass('calendar-last-column')
          )
        )
      )
  );

};
