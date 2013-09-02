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
  // TYPE: Node
  this.text_ = document.createTextNode(EnrollPlanDrop.OPTIONS[1]);
  // TYPE: number
  this.index_ = 1;
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
  this.leftArrow_.click(function() { epd.moveLeft(); });
  this.rightArrow_.click(function() { epd.moveRight(); });
};

/*
 * Moves 'left' in the list of options.
 */
EnrollPlanDrop.prototype.moveLeft = function() {
  if (this.index_ == 0) return;
  if (this.index_ == EnrollPlanDrop.OPTIONS.length - 1) {
    this.rightArrow_.removeClass(EnrollPlanDrop.DISABLED);
  }
  this.index_--;
  this.text_.nodeValue = EnrollPlanDrop.OPTIONS[this.index_];
  if (this.index_ == 0) {
    this.leftArrow_.addClass(EnrollPlanDrop.DISABLED);
  }

  // Alert controller
  this.controller_.setEnrollmentStatus(this.course_, this.index_);
};

/*
 * Moves 'right' in the list of options.
 */
EnrollPlanDrop.prototype.moveRight = function() {
  if (this.index_ == EnrollPlanDrop.OPTIONS.length - 1) return;
  if (this.index_ == 0) {
    this.leftArrow_.removeClass(EnrollPlanDrop.DISABLED);
  }
  this.index_++;
  this.text_.nodeValue = EnrollPlanDrop.OPTIONS[this.index_];
  if (this.index_ == EnrollPlanDrop.OPTIONS.length - 1) {
    this.rightArrow_.addClass(EnrollPlanDrop.DISABLED);
  }

  // Alert controller
  this.controller_.setEnrollmentStatus(this.course_, this.index_);
};

EnrollPlanDrop.OPTIONS = ['Enroll', 'Plan', 'Drop'];
EnrollPlanDrop.DISABLED = 'enroll-plan-drop-disabled';
EnrollPlanDrop.ARROW_CLASS = 'enroll-plan-drop-arrow';
EnrollPlanDrop.LEFT_ARROW = 'enroll-plan-drop-left-arrow';
EnrollPlanDrop.RIGHT_ARROW = 'enroll-plan-drop-right-arrow';
