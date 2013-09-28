/*
 * This implements a simple widget for switching between Enroll, Plan and Drop
 * status for a class.
 */

/*
 * The constructor actually builds the widget. There is no render method.
 * Constructor takes:
 * PARAM-TYPE: jQuery elem The element to fill.
 * PARAM-TYPE: CourseListController controller The controller.
 * PARAM-TYPE: Course course The course to send back to the controller.
 */
EnrollPlanDrop = function(elem, controller, course) {
  // TYPE: jQuery
  this.leftArrow_ = $('<span>').addClass(EnrollPlanDrop.ARROW_CLASS).
                                addClass(EnrollPlanDrop.LEFT_ARROW).
                                text('<');
  // TYPE: number
  this.index_ = course.getStatus().getEnrollmentStatus();
  // TYPE: jQuery
  this.text_ = $('<span>').addClass(EnrollPlanDrop.TEXT).
                           text(EnrollPlanDrop.OPTIONS[this.index_]);
  // TYPE: jQuery
  this.rightArrow_ = $('<span>').addClass(EnrollPlanDrop.ARROW_CLASS).
                                 addClass(EnrollPlanDrop.RIGHT_ARROW).
                                 text('>');
  // TYPE: CourseListController
  this.controller_ = controller;
  // TYPE: Course
  this.course_ = course;

  elem.append(this.leftArrow_, this.text_, this.rightArrow_);

  var epd = this;
  this.text_.click(function() { epd.move(false); });
  this.leftArrow_.click(function() { epd.move(true); });
  this.rightArrow_.click(function() { epd.move(false); });
};

/*
 * Cycles through the list of options.
 * PARAM-TYPE: boolean positive True to cycle through in the positive direction.
 */
EnrollPlanDrop.prototype.move = function(positive) {
  var diff = positive ? 1 : -1;
  var len = EnrollPlanDrop.OPTIONS.length;
  this.index_ = (this.index_ + len + diff) % len;
  this.text_.text(EnrollPlanDrop.OPTIONS[this.index_]);

  // Alert controller
  this.controller_.setEnrollmentStatus(this.course_, this.index_);
};

EnrollPlanDrop.OPTIONS = ['Enroll', 'Plan', 'Drop'];
EnrollPlanDrop.TEXT = 'enroll-plan-drop-text';
EnrollPlanDrop.ARROW_CLASS = 'enroll-plan-drop-arrow';
EnrollPlanDrop.LEFT_ARROW = 'enroll-plan-drop-left-arrow';
EnrollPlanDrop.RIGHT_ARROW = 'enroll-plan-drop-right-arrow';
