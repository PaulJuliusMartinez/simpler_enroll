/*
 * Class for storing some user set info about when they want to take a class.
 */

/*
 * Constructor initializes everything to default values.
 */
Status = function() {
  // TYPE: boolean[3]
  this.willTakeIn_ = [true, true, true];
  // TYPE: enum
  this.enrollment_ = Status.PLAN;
};

/*
 * Set whether a class will be taken in a certain quarter.
 * PARAM-TYPE: number quarter The specific quarter [0-2].
 * PARAM-TYPE: boolean b Whether the class can be taken.
 */
Status.prototype.setQuarterStatus = function(quarter, b) {
  this.willTakeIn_[quarter] = b;
};

/*
 * Change the enrollment status.
 * PARAM-TYPE: enum status The enrollment status.
 */
Status.prototype.setEnrollmentStatus = function(status) {
  this.enrollment_ = status;
};

// Getters for each of these.
Status.prototype.getQuarterStatus = function(quarter) {
  return this.willTakeIn_[quarter];
};
Status.prototype.getEnrollmentStatus = function() { return this.enrollment_; };

Status.ENROLL = 0;
Status.PLAN = 1;
Status.DROP = 2;
