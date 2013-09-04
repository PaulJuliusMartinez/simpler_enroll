/*
 * This class builds a small little popup that appears whenever you hover over a
 * MeetingDisplay.
 */

/*
 * Constructor takes:
 * PARAM-TYPE: jQuery parent The parent div this will be appended to.
 * PARAM-TYPE: Meeting meeting The meeting this is a popup for.
 */
CourseInfoPopup = function(parent, meeting) {
  // TYPE: jQuery
  this.parent_ = parent;
  // TYPE: Meeting
  this.meeting_ = meeting;
};


/*
 * Renders the popup!
 */
CourseInfoPopup.prototype.render = function() {
  var popup = $('<div>').addClass(CourseInfoPopup.POPUP).css('z-index', '1');
  var section = this.meeting_.getSection();
  var course = section.getCourse();

  var courseName = course.getShortName() + ' ' + course.getTitle();
  popup.append($('<p>').text(courseName));

  var units = course.getMinUnits() + '-' + course.getMaxUnits();
  popup.append($('<p>').text(units + ' units'));

  var meetings = section.getMeetings();
  for (var i = 0; i < meetings.length; i++) {
    var m = meetings[i];
    var days = CourseInfoPopup.convertBooleanDaysArrayToString(m.getDays());
    var start = CourseInfoPopup.convertMinutesToTimeString(m.getStartTime());
    var end = CourseInfoPopup.convertMinutesToTimeString(m.getEndTime());
    popup.append($('<p>').text(days + ': ' + start + '-' + end));
  }

  this.parent_.append(popup);

  var width = popup.get()[0].clientWidth;
  var parentWidth = this.parent_.get()[0].clientWidth;
  var height = popup.get()[0].clientHeight;
  var parentHeight = this.parent_.get()[0].clientHeight;

  popup.css('top', '-' + height + 'px');
  popup.css('left', ((parentWidth - width) / 2) + 'px');
  popup.hide();

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
