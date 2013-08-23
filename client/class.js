/*
 * This class represents a single meeting of a course.
 * The course is the object CS['140'], and a class is just one
 * meeting of that, which consists of the day and times it meets.
 */

/*
 * Constructor takes:
 * @param string name The course name.
 * @param boolean[] days Array of length 5, true if class meets that day,
 *     false if not.
 * @param string startTime Start time of the class.
 * @param string endTime End time of the class.
 * @param string state The enrollment status of the class, enrolled or planned.
 * 
 * Both times are in the form HH:MM:SS, in military time
 */
Class = function(name, days, startTime, endTime, state) {
  this.name_ = name;
  this.days_ = days;
  this.startTime_ = startTime;
  this.endTime_ = endTime;
  this.status_ = state;
};

/*
 * Draws the boxes for the classes.
 * @param Jquery parent The Calendar container parent element.
 * @param number opt_number If there are conflicts, which position to place it.
 * @param number opt_total How many conflicting classes there are.
 */
Class.prototype.render = function(parent, opt_number, opt_total) {
  var startHeight = Class.timeStringToPixelHeight(this.startTime_) + 'px';
  var height = (this.hourLength() * Calendar.ROW_HEIGHT) + 'px';

  for (var i = 0; i < 5; i++) {
    if (this.days_[i]) {
      parent.append(
          $('<div>').
            addClass('class-box').
            addClass(this.status_).
            text(this.name_).
            css('top', startHeight).
            css('left',
              (Calendar.HOUR_WIDTH +
               i * (Calendar.DAY_WIDTH - 1)) + 'px').
            css('height', height).
            css('line-height', height)
      );
    }
  }
};
  
/*
 * Turn a HH:MM:SS time into pixels according to the Calendar constants.
 * @param string time The time as a string.
 */
Class.timeStringToPixelHeight = function(time) {
  var hour = parseInt(time.slice(0, 2));
  var minute = parseInt(time.slice(3, 5));
  return (1 + (hour - 9) + (minute / 60)) * Calendar.ROW_HEIGHT;
};

/*
 * Calcuates the length of the class in hours.
 */
Class.prototype.hourLength = function() {
  var startHour = parseInt(this.startTime_.slice(0, 2));
  var startMinute = parseInt(this.startTime_.slice(3, 5));
  var endHour = parseInt(this.endTime_.slice(0, 2));
  var endMinute = parseInt(this.endTime_.slice(3, 5));
  return ((endHour * 60 + endMinute) - (startHour * 60 + startMinute)) / 60;
};
