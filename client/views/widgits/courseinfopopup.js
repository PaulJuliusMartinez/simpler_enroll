/*
 * This class builds a small little popup that appears whenever you hover over a
 * MeetingDisplay.
 */

/*
 * Constructor takes:
 * PARAM-TYPE: jQuery parent The parent div this will be appended to.
 * PARAM-TYPE: Meeting meeting The meeting this is a popup for.
 * PARAM-TYPE: number day The day of the week this popup is for. Used for
 *     alignment.
 */
CourseInfoPopup = function(parent, meeting, day) {
  // TYPE: jQuery
  this.parent_ = parent;
  // TYPE: Meeting
  this.meeting_ = meeting;

  if (day == 0) {
    this.alignment_ = 'left';
  } else if (day == 4) {
    this.alignment_ = 'right';
  }
};


/*
 * CSS style for the popup to set the alignment.
 * TYPE: string
 */
CourseInfoPopup.prototype.alignment_ = '';

/*
 * Renders the popup!
 */
CourseInfoPopup.prototype.render = function() {
  var popup = $('<div>').addClass(CourseInfoPopup.POPUP).css('z-index', '1');
  var section = this.meeting_.getSection();
  var course = section.getCourse();

  // Add Title
  var courseName = course.getShortName() + ': ' + course.getTitle();
  popup.append($('<p>').text(courseName));

  // Add Units
  var units = course.getMinUnits() + '-' + course.getMaxUnits();
  popup.append($('<p>').text(units + ' units'));

  // Iterate through meetings and add their times
  var meetings = section.getMeetings();
  for (var i = 0; i < meetings.length; i++) {
    var m = meetings[i];
    var days = CourseInfoPopup.convertBooleanDaysArrayToString(m.getDays());
    var start = CourseInfoPopup.convertMinutesToTimeString(m.getStartTime());
    var end = CourseInfoPopup.convertMinutesToTimeString(m.getEndTime());
    popup.append($('<p>').text(days + ': ' + start + '-' + end));
  }

  this.parent_.append(popup);

  // Get all the height/widths for positioning the popup
  var width = popup.get()[0].clientWidth;
  var parentWidth = this.parent_.get()[0].clientWidth;
  var height = popup.get()[0].clientHeight;

  popup.css('top', '-' + height + 'px');
  // Special alignments for Monday/Friday
  if (this.alignment_ != '') {
    popup.css(this.alignment_, -1); // -1 for the border
  } else {
    popup.css('left', ((parentWidth - width) / 2) + 'px');
  }
  popup.hide();

  // Add show/hide behavior
  this.parent_.hover(function() { popup.show(); },
                     function() { popup.hide(); });
};

/*
 * Converts a boolean array to a days of the week acronym.
 * PARAM-TYPE: boolean[5] days The days a class meets.
 * RETURN-TYPE: string
 */
CourseInfoPopup.convertBooleanDaysArrayToString = function(days) {
  var str = '';
  if (days[0]) str += 'M';
  if (days[1]) str += 'Tu';
  if (days[2]) str += 'W';
  if (days[3]) str += 'Th';
  if (days[4]) str += 'F';
  return str;
};

/*
 * Converts number of minutes since midnight to a normal time string.
 * PARAM-TYPE: number minutes Minutes since midnight
 */
CourseInfoPopup.convertMinutesToTimeString = function(minutes) {
  var mm = ('00' + (minutes % 60)).slice(-2);
  var hours = (minutes - minutes % 60) / 60;
  var ending = (hours >= 12) ? 'PM' : 'AM';
  if (hours > 12) hours -= 12;
  if (hours == 0) hours = 12;
  return hours + ':' + mm + ' ' + ending;
};

// CSS Constants
CourseInfoPopup.POPUP = 'course-info-popup';
