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


// TYPE: jQuery The actual popup.
CourseInfoPopup.prototype.popup_;

/*
 * CSS style for the popup to set the alignment.
 * TYPE: string
 */
CourseInfoPopup.prototype.alignment_ = '';

/*
 * Renders the popup!
 */
CourseInfoPopup.prototype.render = function() {
  this.popup_ = $('<div>').addClass(CourseInfoPopup.POPUP).css('z-index', '1');
  var section = this.meeting_.getSection();
  var course = section.getCourse();

  // Add Title
  var courseName = course.getShortName() + ': ' + course.getTitle();
  this.popup_.append($('<p>').text(courseName));

  var instructors = '';
  for (var i = 0; i < this.meeting_.getInstructors().length; i++) {
    if (i != 0) instructors += ',';
    instructors += this.meeting_.getInstructors()[i];
  }
  if (instructors != '') {
    this.popup_.append($('<p>').text('Instructors: ' + instructors));
  }

  // Add Units, making sure we say 3 units or 4-5 units, but not 3-3 units.
  var minUnits = course.getMinUnits();
  var maxUnits = course.getMaxUnits();
  var units = (minUnits == maxUnits) ? maxUnits : minUnits + '-' + maxUnits;
  this.popup_.append($('<p>').text(units + ' units'));

  // Iterate through meetings and add their times
  var meetings = section.getMeetings();
  for (var i = 0; i < meetings.length; i++) {
    var m = meetings[i];
    this.popup_.append($('<p>').text(m.toString()));
  }

  this.parent_.append(this.popup_);

  // Get all the height/widths for positioning the popup
  var width = this.popup_.get()[0].clientWidth;
  var parentWidth = this.parent_.get()[0].clientWidth;
  var height = this.popup_.get()[0].clientHeight;

  this.popup_.css('top', '-' + height + 'px');
  // Special alignments for Monday/Friday
  if (this.alignment_ != '') {
    this.popup_.css(this.alignment_, -1); // -1 for the border
  } else {
    this.popup_.css('left', ((parentWidth - width) / 2) + 'px');
  }
  this.popup_.hide();
};

// Shows the popup
CourseInfoPopup.prototype.show = function() { this.popup_.show(); };
// Hides the popup
CourseInfoPopup.prototype.hide = function() { this.popup_.hide(); };

// CSS Constants
CourseInfoPopup.POPUP = 'course-info-popup';
