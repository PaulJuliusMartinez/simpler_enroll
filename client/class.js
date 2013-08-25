/*
 * This class represents a single meeting of a course.
 * The course is the object CS['140'], and a class is just one
 * meeting of that, which consists of the day and times it meets.
 */


/*
 * Constructor takes:
 * @param string name The course name.
 * @param string component The component type of the class (LEC, DIS, etc.)
 * @param boolean[] days Array of length 5, true if class meets that day,
 *     false if not.
 * @param string startTime Start time of the class.
 * @param string endTime End time of the class.
 * @param string state The enrollment status of the class, enrolled or planned.
 * @param string uniqueID A uniqueID for the class.
 *
 * Both times are in the form HH:MM:SS, in military time
 */
Class = function(name, component, days, startTime, endTime, state, uniqueID) {
  this.name_ = name;
  this.component_ = component;
  this.days_ = days;
  // startTime_ and endTime_ store how many minutes after midnight the class
  // starts and ends.
  this.startTime_ = Class.toMinutes(startTime);
  this.endTime_ = Class.toMinutes(endTime);
  this.status_ = state;
  this.uniqueID_ = uniqueID;
};


/*
 * The DOM (Jquery) Elements that the Class is responsible for.
 * @type Array
 */
Class.prototype.elements_ = [];


/*
 * @return string The uniqueID for the class
 */
Class.prototype.getUniqueID = function() {
  return this.uniqueID_;
};


/*
 * @return number Start time of the class in minutes after midnight.
 */
Class.prototype.getStartTime = function() {
  return this.startTime_;
};


/*
 * @return number End time of the class in minutes after midnight.
 */
Class.prototype.getEndTime = function() {
  return this.endTime_;
};


/*
 * @param number day Day of the week between 0 and 4.
 * @return boolean Whether or not the class meets on the given day.
 */
Class.prototype.meetsOn = function(day) {
  assert(0 <= day && day <= 4);
  return this.days_[day];
};


/*
 * Draws the boxes for the classes.
 * @param Jquery parent The Calendar container parent element.
 * @param number day Which day to render the class on (from 0-4).
 * @param number opt_number If there are conflicts, which position to place it.
 * @param number opt_total How many conflicting classes there are.
 */
Class.prototype.render = function(parent, day, opt_number, opt_total) {
  var startHeight = Class.timeToPixelHeight(this.startTime_) + 'px';
  var height = (this.hourLength() * Calendar.ROW_HEIGHT) + 'px';
  var fraction = (opt_number && opt_total) ? (1 / opt_total) : 1;
  var width = Class.PIXEL_WIDTH * fraction;
  var offset = (opt_number && opt_total) ? (opt_number - 1) * (width + 1) : 0;

  if (this.days_[day]) {
    var x = Calendar.HOUR_WIDTH + day * (Calendar.DAY_WIDTH - 1) + offset;
    var dayElem = $('<div>').
                      addClass('class-box').
                      addClass(this.status_).
                      text(this.name_).
                      css('top', startHeight).
                      css('height', height).
                      css('line-height', height).
                      css('left', x + 'px').
                      css('width', width + 'px');
    parent.append(dayElem);
    this.elements_.push(dayElem);
  }
};


/*
 * Un-render the class and remove all associated elements from the DOM.
 */
Class.prototype.unrender = function() {
  for (var i = 0; i < this.elements_.length; i++) {
    this.elements_[i].remove();
  };
  this.elements_ = [];
};


/*
 * Returns whether or not a class conflicts with another class.
 * @param Class otherClass The other class.
 * @param number day The day of the week (0-4).
 */
Class.prototype.conflictsWithOnDay = function(otherClass, day) {
  if (!this.meetsOn(day) || !otherClass.meetsOn(day)) return false;
  if (this.startTime_ >= otherClass.getEndTime()) return false;
  if (this.endTime_ <= otherClass.getStartTime()) return false;
  return true;
};


/*
 * The fullsize width of a class box in pixels.
 */
Class.PIXEL_WIDTH = 71;


/*
 * Converts HH:MM:SS into minutes
 * @param string time Time in HH:MM:SS format (Seconds are ignored.)
 */
Class.toMinutes = function(time) {
  var hours = parseInt(time.slice(0, 2));
  var minutes = parseInt(time.slice(3, 5));
  return hours * 60 + minutes;
};


/*
 * Turn a HH:MM:SS time into pixels according to the Calendar constants.
 * @param number time The time as minutes from midnight
 */
Class.timeToPixelHeight = function(time) {
  var minutesOffsetFrom9 = time - 60 * 9;
  // +1 for the header row
  return (1 + (minutesOffsetFrom9 / 60)) * Calendar.ROW_HEIGHT;
};


/*
 * Calcuates the length of the class in hours.
 */
Class.prototype.hourLength = function() {
  return (this.endTime_ - this.startTime_) / 60;
};
