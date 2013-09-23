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
  // TYPE: Section
  this.section_ = section;
  // TYPE: boolean[]
  this.days_ = obj[CourseConstants.DAYS];
  // TYPE: number
  this.startTime_ = Meeting.parseTimeString(obj[CourseConstants.START_TIME]);
  // TYPE: number
  this.endTime_ = Meeting.parseTimeString(obj[CourseConstants.END_TIME]);
  // TYPE: string
  this.location_ = obj[CourseConstants.LOCATION] || 'N/A';
  // TYPE: number
  this.id_ = UniqueID.newID();
};


// First some simple getters.
Meeting.prototype.getSection = function() { return this.section_; };
Meeting.prototype.getDays = function() { return this.days_.slice(); };
Meeting.prototype.getStartTime = function() { return this.startTime_; };
Meeting.prototype.getEndTime = function() { return this.endTime_; };
Meeting.prototype.getLocation = function() { return this.location_; };
Meeting.prototype.getID = function() { return this.id_; };

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

/*
 * Converts the meeting to a human readable string.
 * RETURN-TYPE: string
 */
Meeting.prototype.toString = function() {
  var days = Meeting.convertBooleanDaysArrayToString(this.getDays());
  var start = Meeting.convertMinutesToTimeString(this.getStartTime());
  var end = Meeting.convertMinutesToTimeString(this.getEndTime());
  var location = (this.location_ == 'N/A') ? '' : ' in ' + this.location_;
  return days + ': ' + start + '-' + end + location;
};

/*
 * Converts a boolean array to a days of the week acronym.
 * PARAM-TYPE: boolean[5] days The days a class meets.
 * RETURN-TYPE: string
 */
Meeting.convertBooleanDaysArrayToString = function(days) {
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
Meeting.convertMinutesToTimeString = function(minutes) {
  var mm = ('00' + (minutes % 60)).slice(-2);
  var hours = (minutes - minutes % 60) / 60;
  var ending = (hours >= 12) ? 'PM' : 'AM';
  if (hours > 12) hours -= 12;
  if (hours == 0) hours = 12;
  return hours + ':' + mm + ' ' + ending;
};

/*
 * Sort function for Meetings.
 */
Meeting.sort = function(a, b) {
  if (a.startTime_ != b.startTime_) return a.startTime_ - b.startTime_;
  return a.endTime_ - b.endTime_;
};
