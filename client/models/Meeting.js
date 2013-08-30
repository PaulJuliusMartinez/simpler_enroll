/*
 * Class that represents a single meeting time of a Section.
 */

/*
 * Constructor takes the Section the Meeting is a part of as well as the JSON
 * object representing the meeting.
 * PARAM-TYPE: Section section The Section the Meeting is a part of.
 * PARAM-TYPE: Object obj The JSON object with the Meeting data.
 */
Meeting = function(section, obj) {
  /* TYPE: Section */
  this.section_ = section;
  /* TYPE: boolean[] */
  this.days_ = obj[CourseConstants.DAYS];
  /* TYPE: number */
  this.startTime_ = Meeting.parseTimeString(obj[CourseConstants.START_TIME]);
  /* TYPE: number */
  this.endTime_ = Meeting.parseTimeString(obj[CourseConstants.END_TIME]);
};

/*
 * Helper function for parsing the "HH:MM:SS" time string into number of
 * minutes.
 * PARAM-TYPE: string timeString The "HH:MM:SS" string.
 * RETURN-TYPE: number
 */
Meeting.parseTimeString = function(timeString) {
  var hours = parseInt(timeString.slice(0, 2));
  var minutes = parseInt(timeString.slice(3, 5));
  return hours * 60 + minutes;
};

/*
 * Checks if two meetings conflict.
 * PARAM-TYPE: Meeting other The other meeting.
 * RETURN-TYPE: boolean
 */
Meeting.prototype.conflictsWith = function(other) {
  // First check if they ever meet on the same day.
  var theyNeverMeetOnTheSameDay = true;
  for (var i = 0; i < 5; i++) {
    if (this.meetsOn(i) && other.meetsOn(i)) theyNeverMeetOnTheSameDay = false;
  }
  if (theyNeverMeetOnTheSameDay) return false;
  // Then compare start and end times.
  return !(this.endTime_ <= other.startTime_ ||
           this.startTime_ >= other.endTime_);
};

/*
 * Check whether the meeting meets on a certain day.
 * PARAM-TYPE: number day The day of the week, Monday - Friday (0 - 4).
 * RETURN-TYPE: boolean
 */
Meeting.prototype.meetsOn = function(day) {
  return this.days_[day];
};

/*
 * Get how long the class is in minutes.
 * RETURN-TYPE: number
 */
Meeting.prototype.getLength = function() {
  return this.endTime_ - this.startTime_;
};
